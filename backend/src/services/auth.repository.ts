import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

const pool = new Pool({ connectionString: env.postgresUrl });

export const authRepository = {
  async findByEmail(email: string) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ?? null;
  },

  async findById(id: string) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },

  async createUser(email: string, password_hash: string) {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, password_hash, created_at, updated_at',
      [email, password_hash],
    );
    return result.rows[0];
  },

  async storeRefreshToken(userId: string, token: string) {
    const tokenHash = await bcrypt.hash(token, 10);
    await pool.query(
  "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 days')",
  [userId, tokenHash],
);
  },

  async findRefreshToken(token: string) {
    const rows = await pool.query('SELECT * FROM refresh_tokens', []);
    for (const row of rows.rows) {
      const ok = await bcrypt.compare(token, row.token_hash);
      if (ok) return row;
    }
    return null;
  },

  async revokeRefreshToken(id: string) {
    await pool.query('DELETE FROM refresh_tokens WHERE id = $1', [id]);
  },
};
