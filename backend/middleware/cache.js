// middleware/cache.js
import redisClient from "../config/redis.js";

/**
 * Cache middleware with safety guards and custom key generation.
 * @param {Object} options
 * @param {number} options.duration - Cache expiration in seconds (default: 3600)
 * @param {function} options.keyGenerator - Custom key generator function (req => string)
 */
const cache = (options = {}) => {
  // Support numeric duration parameter for backwards compatibility/simplicity
  const config = typeof options === "number" ? { duration: options } : options;
  const { duration = 3600, keyGenerator } = config;

  return async (req, res, next) => {
    // Bypass caching if Redis is disabled, connection failed, or not a GET request
    if (
      process.env.ENABLE_REDIS !== "true" ||
      !redisClient ||
      req.method !== "GET"
    ) {
      return next();
    }

    // Generate cache key safely
    let key;
    try {
      key = keyGenerator ? keyGenerator(req) : req.originalUrl;
    } catch (err) {
      console.error("Cache key generation failed:", err);
      return next();
    }

    try {
      // Return cached response if available
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Store the original res.json behavior
      const originalJson = res.json;

      // Safely override res.json preserving chaining
      res.json = function (body) {
        // Restore res.json to avoid infinite recursion or pollution
        res.json = originalJson;

        // Asynchronously set cache, catching any Redis connection issues
        redisClient
          .set(key, JSON.stringify(body), { EX: duration })
          .catch((err) => console.error("Redis set cache error:", err));

        return originalJson.call(this, body);
      };

      next();
    } catch (err) {
      console.error("Redis get cache error:", err);
      next();
    }
  };
};

export default cache;
