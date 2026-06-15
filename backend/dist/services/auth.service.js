"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
exports.createAuthService = createAuthService;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const auth_repository_1 = require("../services/auth.repository");
const SALT_ROUNDS = 10;
function signToken(subject, expiresIn) {
    return jsonwebtoken_1.default.sign({ sub: subject }, env_1.env.jwtSecret, { expiresIn: expiresIn });
}
function authError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
function createAuthService(repository) {
    return {
        async register(dto) {
            const existing = await repository.findByEmail(dto.email);
            if (existing)
                throw authError('Email already registered', 409);
            const password_hash = await bcryptjs_1.default.hash(dto.password, SALT_ROUNDS);
            const user = await repository.createUser(dto.email, password_hash);
            return { success: true, userId: user.id };
        },
        async login(dto) {
            const user = await repository.findByEmail(dto.email);
            if (!user)
                throw authError('Invalid credentials', 401);
            const valid = await bcryptjs_1.default.compare(dto.password, user.password_hash);
            if (!valid)
                throw authError('Invalid credentials', 401);
            const accessToken = signToken(user.id, env_1.env.jwtAccessExpiresIn);
            const refreshToken = signToken(user.id, env_1.env.jwtRefreshExpiresIn);
            await repository.storeRefreshToken(user.id, refreshToken);
            return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
        },
        async refresh(dto) {
            const payload = jsonwebtoken_1.default.verify(dto.refreshToken, env_1.env.jwtSecret);
            if (!payload.sub)
                throw authError('Invalid refresh token', 401);
            const current = await repository.findRefreshToken(dto.refreshToken);
            if (!current)
                throw authError('Refresh token revoked', 401);
            await repository.revokeRefreshToken(current.id);
            const accessToken = signToken(payload.sub, env_1.env.jwtAccessExpiresIn);
            const refreshToken = signToken(payload.sub, env_1.env.jwtRefreshExpiresIn);
            await repository.storeRefreshToken(payload.sub, refreshToken);
            const user = await repository.findById(payload.sub);
            if (!user)
                throw authError('User not found', 404);
            return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
        },
        async logout(dto) {
            const payload = jsonwebtoken_1.default.verify(dto.refreshToken, env_1.env.jwtSecret);
            if (!payload.sub)
                throw authError('Invalid refresh token', 401);
            const current = await repository.findRefreshToken(dto.refreshToken);
            if (current)
                await repository.revokeRefreshToken(current.id);
            return { success: true };
        },
        async verifyAccessToken(token) {
            return jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        },
    };
}
exports.authService = createAuthService(auth_repository_1.authRepository);
