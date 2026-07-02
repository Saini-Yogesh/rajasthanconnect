import { createClient } from "redis";

const enableRedis = process.env.ENABLE_REDIS === "true";
let redisClient = null;

if (enableRedis && process.env.REDIS_URL) {
  try {
    redisClient = createClient({ url: process.env.REDIS_URL });

    redisClient.on("connect", () => {
      console.log("🔌 Connected to Redis");
    });

    redisClient.on("error", (err) => {
      console.log("❌ Redis error: ", err);
    });

    await redisClient.connect();
  } catch (err) {
    console.error("❌ Failed to connect to Redis: ", err.message);
    redisClient = null;
  }
} else {
  console.log("ℹ️ Redis caching is disabled via ENABLE_REDIS variable.");
}

export default redisClient;
