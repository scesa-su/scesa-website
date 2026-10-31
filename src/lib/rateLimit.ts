// shortcut: counts live in memory per serverless instance and reset on a cold start, so the limits are per
// instance, not global. Upgrade to a shared store (Upstash / Vercel KV) if spam gets through.

/** Fixed-window limiter: allows `limit` hits per key per `windowMs`. Returns false once the key is over. */
export function createRateLimiter(limit: number, windowMs: number) {
  const windows = new Map<string, { count: number; resetAt: number }>();

  return function allow(key: string, now = Date.now()): boolean {
    if (windows.size > 10_000) {
      for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
    }
    const w = windows.get(key);
    if (!w || w.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    w.count += 1;
    return w.count <= limit;
  };
}

/** First hop of x-forwarded-for, which Vercel sets to the client's address. */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
