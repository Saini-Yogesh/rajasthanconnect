import redisClient from "./config/redis.js";

await redisClient.connect();

await redisClient.flushDb();

console.log("Redis cache cleared");
process.exit(0);