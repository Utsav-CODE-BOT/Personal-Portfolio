/**
 * Serverless Rate Limiter
 * Implements per-IP and global fixed-window limits with zero external cost.
 */
export class RateLimiter {
  constructor(options = {}) {
    this.chatRate = options.chatRate || process.env.CHAT_RATE_LIMIT || '10/minute';
    this.globalRate = options.globalRate || process.env.GLOBAL_RATE_LIMIT || '300/hour';
    this.storage = new Map();
  }

  parseLimit(limitStr) {
    const [count, period] = limitStr.split('/');
    const periodMap = {
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400
    };
    return {
      limit: parseInt(count, 10) || 10,
      windowSeconds: periodMap[period] || 60
    };
  }

  checkLimit(key, limitStr) {
    const now = Math.floor(Date.now() / 1000);
    const { limit, windowSeconds } = this.parseLimit(limitStr);

    let record = this.storage.get(key);

    if (!record || now >= record.resetAt) {
      record = {
        count: 1,
        resetAt: now + windowSeconds
      };
      this.storage.set(key, record);
      return { isAllowed: true, retryAfter: 0 };
    }

    if (record.count >= limit) {
      const retryAfter = Math.max(1, record.resetAt - now);
      return { isAllowed: false, retryAfter };
    }

    record.count += 1;
    return { isAllowed: true, retryAfter: 0 };
  }

  check(ip = 'anonymous') {
    // 1. Check global limit
    const globalCheck = this.checkLimit('global', this.globalRate);
    if (!globalCheck.isAllowed) {
      return {
        isAllowed: false,
        status: 429,
        body: {
          detail: 'Global rate limit exceeded',
          type: 'rate_limit_exceeded',
          limit: this.globalRate,
          retry_after: globalCheck.retryAfter,
          friendly_message: `You've reached the global rate limit. Please try again in ${globalCheck.retryAfter} seconds.`
        }
      };
    }

    // 2. Check per-IP chat limit
    const chatKey = `chat:${ip}`;
    const chatCheck = this.checkLimit(chatKey, this.chatRate);
    if (!chatCheck.isAllowed) {
      return {
        isAllowed: false,
        status: 429,
        body: {
          detail: 'Chat rate limit exceeded',
          type: 'chat_rate_limit_exceeded',
          limit: this.chatRate,
          retry_after: chatCheck.retryAfter,
          friendly_message: "You're sending messages too quickly! Please wait before sending another message."
        }
      };
    }

    return { isAllowed: true };
  }
}

export const defaultLimiter = new RateLimiter();
