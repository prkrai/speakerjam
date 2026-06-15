import { NextFunction, Request, Response } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
});

export async function authRateLimit(req: Request, res: Response, next: NextFunction) {
  try {
    await limiter.consume(req.ip || 'unknown');
    next();
  } catch (_error) {
    res.status(429).json({ success: false, message: 'Too many requests' });
  }
}
