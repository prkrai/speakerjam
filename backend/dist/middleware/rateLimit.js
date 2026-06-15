"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimit = authRateLimit;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const limiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 10,
    duration: 60,
});
async function authRateLimit(req, res, next) {
    try {
        await limiter.consume(req.ip || 'unknown');
        next();
    }
    catch (_error) {
        res.status(429).json({ success: false, message: 'Too many requests' });
    }
}
