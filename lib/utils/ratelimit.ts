// Shared Upstash rate limiter factory
// Returns null if env vars not set (dev / CI) — callers should fail open

export async function getRatelimiter(options: {
  requests: number
  window: string  // e.g. '1 m', '15 m', '1 h'
  prefix: string
}) {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis }     = await import('@upstash/redis')

  const redis = new Redis({ url, token })
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(options.requests, options.window as Parameters<typeof Ratelimit.slidingWindow>[1]),
    prefix: `formify:${options.prefix}`,
  })
}

export async function checkLimit(key: string, options: {
  requests: number
  window: string
  prefix: string
}): Promise<boolean> {
  try {
    const rl = await getRatelimiter(options)
    if (!rl) return false  // fail open in dev
    const { success } = await rl.limit(key)
    return !success  // true = is rate limited
  } catch {
    return false  // fail open if Redis unreachable
  }
}
