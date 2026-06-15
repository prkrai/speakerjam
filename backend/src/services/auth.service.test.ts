import { describe, expect, it } from 'vitest';
import { createAuthService } from './auth.service';

describe('authService', () => {
  it('registers a new user', async () => {
    const repo = {
      findByEmail: async () => null,
      createUser: async () => ({ id: 'u1', email: 'a@b.com' }),
      storeRefreshToken: async () => undefined,
      findRefreshToken: async () => null,
      revokeRefreshToken: async () => undefined,
      findById: async () => ({ id: 'u1', email: 'a@b.com' }),
    };

    const service = createAuthService(repo as any);
    const result = await service.register({ email: 'a@b.com', password: 'Password123!' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid login', async () => {
    const repo = {
      findByEmail: async () => ({ id: 'u1', email: 'a@b.com', password_hash: '$2a$10$invalid' }),
      createUser: async () => ({ id: 'u1', email: 'a@b.com' }),
      storeRefreshToken: async () => undefined,
      findRefreshToken: async () => null,
      revokeRefreshToken: async () => undefined,
      findById: async () => ({ id: 'u1', email: 'a@b.com' }),
    };

    const service = createAuthService(repo as any);
    await expect(service.login({ email: 'a@b.com', password: 'wrong' })).rejects.toMatchObject({ statusCode: 401 });
  });
});
