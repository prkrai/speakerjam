import { describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRoutes from './auth';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('auth routes', () => {
  it('rejects invalid payload', async () => {
    const res = await request(app).post('/auth/register').send({ email: 'bad', password: 'x' });
    expect(res.status).toBe(400);
  });
});
