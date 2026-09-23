/**
 * API 访问中间件
 * 校验请求来源（Origin / Referer）与站点主机一致，防止跨站请求伪造（CSRF）
 */
export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event);
  const url = requestUrl.pathname;
  // 仅拦截 API 请求
  if (url !== "/api" && !url.startsWith("/api/")) return;

  const origin = getRequestHeader(event, "origin");
  const referer = getRequestHeader(event, "referer");
  const source = origin || referer;

  // 无来源信息直接拒绝（例如 curl、脚本等非浏览器客户端）
  if (!source) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access Denied",
    });
  }

  // 校验来源主机与请求主机一致
  let sourceOrigin = "";
  try {
    sourceOrigin = new URL(source).origin;
  } catch {
    throw createError({
      statusCode: 403,
      statusMessage: "Access Denied",
    });
  }

  if (sourceOrigin !== requestUrl.origin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access Denied",
    });
  }
});
