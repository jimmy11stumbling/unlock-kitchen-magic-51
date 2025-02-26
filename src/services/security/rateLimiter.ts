
interface RateLimitEntry {
  count: number;
  timestamp: number;
}

class RateLimiter {
  private static instance: RateLimiter;
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs = 60000; // 1 minute
  private readonly maxRequests = 60; // 60 requests per minute

  private constructor() {}

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  checkLimit(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry) {
      this.limits.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (now - entry.timestamp > this.windowMs) {
      this.limits.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  clearExpiredEntries() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now - entry.timestamp > this.windowMs) {
        this.limits.delete(key);
      }
    }
  }
}

export const rateLimiter = RateLimiter.getInstance();
