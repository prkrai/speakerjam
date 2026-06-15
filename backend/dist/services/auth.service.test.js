"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_service_1 = require("./auth.service");
(0, vitest_1.describe)('authService', () => {
    (0, vitest_1.it)('registers a new user', async () => {
        const repo = {
            findByEmail: async () => null,
            createUser: async () => ({ id: 'u1', email: 'a@b.com' }),
            storeRefreshToken: async () => undefined,
            findRefreshToken: async () => null,
            revokeRefreshToken: async () => undefined,
            findById: async () => ({ id: 'u1', email: 'a@b.com' }),
        };
        const service = (0, auth_service_1.createAuthService)(repo);
        const result = await service.register({ email: 'a@b.com', password: 'Password123!' });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)('rejects invalid login', async () => {
        const repo = {
            findByEmail: async () => ({ id: 'u1', email: 'a@b.com', password_hash: '$2a$10$invalid' }),
            createUser: async () => ({ id: 'u1', email: 'a@b.com' }),
            storeRefreshToken: async () => undefined,
            findRefreshToken: async () => null,
            revokeRefreshToken: async () => undefined,
            findById: async () => ({ id: 'u1', email: 'a@b.com' }),
        };
        const service = (0, auth_service_1.createAuthService)(repo);
        await (0, vitest_1.expect)(service.login({ email: 'a@b.com', password: 'wrong' })).rejects.toMatchObject({ statusCode: 401 });
    });
});
