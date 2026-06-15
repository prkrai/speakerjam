import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  postgresUrl: process.env.DATABASE_URL || 'postgres://syncjam:syncjam@localhost:5432/syncjam',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};
