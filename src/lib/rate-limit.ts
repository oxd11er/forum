const memory = new Map<string, { count: number; windowStart: number }>();

export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const entry = memory.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    memory.set(key, { count: 1, windowStart: now });
    return { ok: true, remaining: max - 1 };
  }

  if (entry.count >= max) return { ok: false, remaining: 0 };

  entry.count += 1;
  return { ok: true, remaining: max - entry.count };
}
