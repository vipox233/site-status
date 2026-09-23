import { createHash, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";
import { signJwt } from "../utils/jwt";
import { checkRateLimit, resetRateLimit } from "../utils/rate-limit";

const isProd = process.env.NODE_ENV === "production";

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    code: 200 | 401 | 429 | 500;
    message: string;
  }> => {
    try {
      const config = useRuntimeConfig();
      const { sitePassword } = config;

      if (!sitePassword) {
        throw new Error("Site password not configured");
      }

      // 限流：同一 IP 10 分钟内最多尝试 5 次
      const forwardedIp = config.clientIpHeader
        ? getRequestHeader(event, config.clientIpHeader)?.trim()
        : undefined;
      const clientIp =
        forwardedIp && isIP(forwardedIp)
          ? forwardedIp
          : getRequestIP(event) || "unknown";
      if (!checkRateLimit(clientIp)) {
        setResponseStatus(event, 429);
        return {
          code: 429,
          message: "Too many attempts, please try again later",
        };
      }

      const body = await readBody(event);
      // Buffer.from 会忽略非法后缀，因此必须先验证完整摘要格式。
      if (
        typeof body?.password !== "string" ||
        !/^[a-f0-9]{64}$/.test(body.password)
      ) {
        setResponseStatus(event, 401);
        return { code: 401, message: "password is incorrect" };
      }

      // 密码验证（恒定时间比较，防时序攻击）
      const hashedPassword = createHash("sha256")
        .update(sitePassword)
        .digest("hex");
      const received = Buffer.from(body.password, "hex");
      const expected = Buffer.from(hashedPassword, "hex");
      const isMatch =
        received.length === expected.length &&
        timingSafeEqual(received, expected);

      if (!isMatch) {
        setResponseStatus(event, 401);
        return {
          code: 401,
          message: "password is incorrect",
        };
      }

      // jwt token
      const token = await signJwt("30d");
      resetRateLimit(clientIp);
      // 设置 Cookie
      setCookie(event, "authToken", token, {
        httpOnly: true,
        secure: isProd,
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "strict",
      });
      return {
        code: 200,
        message: "password is correct",
      };
    } catch (error) {
      console.error("Password validation error:", error);
      setResponseStatus(event, 500);
      return {
        code: 500,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);
