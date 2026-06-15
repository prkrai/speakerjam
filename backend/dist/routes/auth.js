"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const auth_service_1 = require("../services/auth.service");
const validate_1 = require("../middleware/validate");
const errorHandler_1 = require("../middleware/errorHandler");
const rateLimit_1 = require("../middleware/rateLimit");
const secureCookies_1 = require("../middleware/secureCookies");
const router = express_1.default.Router();
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
router.post('/register', rateLimit_1.authRateLimit, (0, validate_1.validateBody)(registerSchema), async (req, res, next) => {
    try {
        const result = await auth_service_1.authService.register(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', rateLimit_1.authRateLimit, (0, validate_1.validateBody)(loginSchema), async (req, res, next) => {
    try {
        const result = await auth_service_1.authService.login(req.body);
        res.cookie('refresh_token', result.refreshToken, (0, secureCookies_1.getCookieOptions)());
        res.status(200).json({ accessToken: result.accessToken, user: result.user });
    }
    catch (error) {
        next(error);
    }
});
router.post('/refresh', rateLimit_1.authRateLimit, (0, validate_1.validateBody)(refreshSchema), async (req, res, next) => {
    try {
        const result = await auth_service_1.authService.refresh(req.body);
        res.cookie('refresh_token', result.refreshToken, (0, secureCookies_1.getCookieOptions)());
        res.status(200).json({ accessToken: result.accessToken, user: result.user });
    }
    catch (error) {
        next(error);
    }
});
router.post('/logout', rateLimit_1.authRateLimit, (0, validate_1.validateBody)(refreshSchema), async (req, res, next) => {
    try {
        const result = await auth_service_1.authService.logout(req.body);
        res.clearCookie('refresh_token', (0, secureCookies_1.getCookieOptions)());
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
router.use(errorHandler_1.errorHandler);
exports.default = router;
