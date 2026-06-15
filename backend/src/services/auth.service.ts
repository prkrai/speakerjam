import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthResponse, LoginDto, RefreshDto, RegisterDto } from '../types/auth';
import { authRepository } from '../services/auth.repository';

const SALT_ROUNDS = 10;

function signToken(subject: string, expiresIn: string) {
  return jwt.sign({ sub: subject }, env.jwtSecret as jwt.Secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
}

function authError(message: string, statusCode: number) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

export function createAuthService(repository: typeof authRepository) {
  return {
    async register(dto: RegisterDto) {
      const existing = await repository.findByEmail(dto.email);
      if (existing) throw authError('Email already registered', 409);

      const password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
      const user = await repository.createUser(dto.email, password_hash);
      return { success: true, userId: user.id };
    },

    async login(dto: LoginDto): Promise<AuthResponse> {
      const user = await repository.findByEmail(dto.email);
      if (!user) throw authError('Invalid credentials', 401);

      const valid = await bcrypt.compare(dto.password, user.password_hash);
      if (!valid) throw authError('Invalid credentials', 401);

      const accessToken = signToken(user.id, env.jwtAccessExpiresIn);
      const refreshToken = signToken(user.id, env.jwtRefreshExpiresIn);
      await repository.storeRefreshToken(user.id, refreshToken);

      return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
    },

    async refresh(dto: RefreshDto): Promise<AuthResponse> {
      const payload = jwt.verify(dto.refreshToken, env.jwtSecret) as { sub?: string };
      if (!payload.sub) throw authError('Invalid refresh token', 401);

      const current = await repository.findRefreshToken(dto.refreshToken);
      if (!current) throw authError('Refresh token revoked', 401);

      await repository.revokeRefreshToken(current.id);

      const accessToken = signToken(payload.sub, env.jwtAccessExpiresIn);
      const refreshToken = signToken(payload.sub, env.jwtRefreshExpiresIn);
      await repository.storeRefreshToken(payload.sub, refreshToken);

      const user = await repository.findById(payload.sub);
      if (!user) throw authError('User not found', 404);

      return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
    },

    async logout(dto: RefreshDto) {
      const payload = jwt.verify(dto.refreshToken, env.jwtSecret) as { sub?: string };
      if (!payload.sub) throw authError('Invalid refresh token', 401);

      const current = await repository.findRefreshToken(dto.refreshToken);
      if (current) await repository.revokeRefreshToken(current.id);
      return { success: true };
    },

    async verifyAccessToken(token: string) {
      return jwt.verify(token, env.jwtSecret) as { sub: string };
    },
  };
}

export const authService = createAuthService(authRepository);

