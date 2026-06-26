/**
 * Boomzy — Express Server Entry Point
 *
 * Boots the Express application, mounts API routes, and starts listening.
 * Environment variables are loaded from .env via dotenv.
 */

import dotenv from 'dotenv';
dotenv.config();

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { rateLimit } from 'express-rate-limit';

import leadsRouter from './routes/leads.js';
import newsletterRouter from './routes/newsletter.js';
import analyticsRouter from './routes/analytics.js';

// ── App Initialisation ───────────────────────
const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

// Trust proxy headers (Cloudflare, App Hosting, Nginx, Load Balancers)
app.set('trust proxy', 1);

// ── Rate Limiters (DDoS & Abuse Prevention) ──
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 150, // Limit each IP to 150 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 submissions per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many form submissions. Please wait 15 minutes before trying again.',
  },
});

// ── Global Middleware ────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  })
);
app.use(express.json({ limit: '10mb' }));
app.use('/api/', globalLimiter);
// ── Health Check ─────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────
app.use('/api/leads', submissionLimiter, leadsRouter);
app.use('/api/newsletter', submissionLimiter, newsletterRouter);
app.use('/api/analytics', analyticsRouter);

// ── 404 Catch-All ────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ── Global Error Handler ─────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server] Unhandled error:', err.message);
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});

// ── Start ────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   Boomzy API Server                     ║
  ║   Running on http://localhost:${PORT}      ║
  ║   Environment: ${(process.env.NODE_ENV ?? 'development').padEnd(24)}║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
