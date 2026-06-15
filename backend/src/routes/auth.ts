import express from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { validateBody } from '../middleware/validate';
import { errorHandler } from '../middleware/errorHandler';
import { authRateLimit } from '../middleware/rateLimit';
import { getCookieOptions } from '../middleware/secureCookies';

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

router.post('/register', authRateLimit, validateBody(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/login', authRateLimit, validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.cookie('refresh_token', result.refreshToken, getCookieOptions());
    res.status(200).json({ accessToken: result.accessToken, user: result.user });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', authRateLimit, validateBody(refreshSchema), async (req, res, next) => {
  try {
    const result = await authService.refresh(req.body);
    res.cookie('refresh_token', result.refreshToken, getCookieOptions());
    res.status(200).json({ accessToken: result.accessToken, user: result.user });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', authRateLimit, validateBody(refreshSchema), async (req, res, next) => {
  try {
    const result = await authService.logout(req.body);
    res.clearCookie('refresh_token', getCookieOptions());
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;
