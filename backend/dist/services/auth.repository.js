"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const pg_1 = require("pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const pool = new pg_1.Pool({ connectionString: env_1.env.postgresUrl });
exports.authRepository = {
    async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] ?? null;
    },
    async findById(id) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0] ?? null;
    },
    async createUser(email, password_hash) {
        const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, password_hash, created_at, updated_at', [email, password_hash]);
        return result.rows[0];
    },
    async storeRefreshToken(userId, token) {
        const tokenHash = await bcryptjs_1.default.hash(token, 10);
        await pool.query('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL \"30 days\")', [userId, tokenHash]);
    },
    async findRefreshToken(token) {
        const rows = await pool.query('SELECT * FROM refresh_tokens', []);
        for (const row of rows.rows) {
            const ok = await bcryptjs_1.default.compare(token, row.token_hash);
            if (ok)
                return row;
        }
        return null;
    },
    async revokeRefreshToken(id) {
        await pool.query('DELETE FROM refresh_tokens WHERE id = $1', [id]);
    },
};
