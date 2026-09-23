import { LRUCache } from "lru-cache";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

// 单实例内存限流：有容量上限、到期清理，不跨云函数实例共享。
const attempts = new LRUCache<string, number>({
  max: 10000,
  ttl: WINDOW_MS,
  ttlAutopurge: true,
});

export const checkRateLimit = (key: string): boolean => {
  const count = attempts.get(key) || 0;
  if (count >= MAX_ATTEMPTS) return false;
  const ttl = count ? attempts.getRemainingTTL(key) : WINDOW_MS;
  attempts.set(key, count + 1, { ttl });
  return true;
};

export const resetRateLimit = (key: string): void => {
  attempts.delete(key);
};
