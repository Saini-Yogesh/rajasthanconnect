import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/api.js';
import aiRouter from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Lightweight in-memory rate limiter to secure API against quota exhaust abuse
const rateLimiter = (limitWindowMs, maxRequests) => {
  const ipRequests = new Map();
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    
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
        error: 'Too Many Requests',
        message: 'You have exceeded the request rate. Please try again in a minute.'
      });
    }
    next();
  };
};

// Apply rate limiter specifically to AI endpoints to safeguard Gemini budgets
app.use('/api/ai', rateLimiter(60000, 15), aiRouter);
app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    databaseFallback: !process.env.SUPABASE_URL,
    aiFallback: !process.env.GEMINI_API_KEY
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 RajasthanConnect API Server running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/health`);
});
