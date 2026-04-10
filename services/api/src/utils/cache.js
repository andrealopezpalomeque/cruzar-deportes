const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const STALE_TTL = 60 * 60 * 1000; // 1 hour for stale fallback

class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) return null;
    return entry.value;
  }

  getStale(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.staleAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value, ttl = DEFAULT_TTL) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      staleAt: Date.now() + STALE_TTL,
    });
  }

  invalidatePrefix(prefix) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  clear() {
    this.store.clear();
  }
}

const cache = new MemoryCache();

module.exports = { cache };
