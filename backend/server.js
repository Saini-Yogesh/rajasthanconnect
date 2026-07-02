import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./routes/api.js";
import aiRouter from "./routes/ai.js";
import cache from "./middleware/cache.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Safe CORS configuration allowing localhost, your custom domain, and Vercel deployments
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://rajasthanconnect.in",
  "https://www.rajasthanconnect.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/rajasthanconnect-.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Manual security headers middleware (no dependencies required)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  next();
});

app.use(express.json());

// Log format dynamically changes based on environment
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Lightweight in-memory rate limiter to secure API against quota exhaust abuse
const rateLimiter = (limitWindowMs, maxRequests) => {
  const ipRequests = new Map();
  return (req, res, next) => {
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    // Prevent memory leaks: clean up expired IP records when the map grows large
    if (ipRequests.size > 2000) {
      for (const [key, data] of ipRequests.entries()) {
        if (now > data.resetTime) {
          ipRequests.delete(key);
        }
      }
    }

    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, { count: 1, resetTime: now + limitWindowMs });
      return next();
    }

    const clientData = ipRequests.get(ip);
    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + limitWindowMs;
      return next();
    }

    clientData.count += 1;
    if (clientData.count > maxRequests) {
      return res.status(429).json({
        error: "Too Many Requests",
        message:
          "You have exceeded the request rate. Please try again in a minute.",
      });
    }
    next();
  };
};

// Apply rate limiter specifically to AI endpoints to safeguard Gemini budgets
app.use("/api/ai", rateLimiter(60000, 15), aiRouter);

// Apply cache middleware to API endpoints (caches GET requests for 1 week)
app.use("/api", cache(604800), apiRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    databaseFallback: !process.env.SUPABASE_URL,
    aiFallback: !process.env.GEMINI_API_KEY,
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack);

  const response = { error: "Internal Server Error" };
  // Only expose database/stack details in non-production environments
  if (process.env.NODE_ENV !== "production") {
    response.message = err.message;
    response.stack = err.stack;
  } else {
    response.message = "An unexpected error occurred. Please try again later.";
  }

  res.status(500).json(response);
});

app.listen(PORT, () => {
  console.log(`🚀 RajasthanConnect API Server running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/health`);
});
