"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.songRepository = void 0;
const pg_1 = require("pg");
const env_1 = require("../config/env");
const pool = new pg_1.Pool({ connectionString: env_1.env.postgresUrl });
exports.songRepository = {
    async createSong(payload) {
        const result = await pool.query(`INSERT INTO songs (owner_user_id, room_id, original_filename, stored_filename, mime_type, duration_seconds, file_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`, [payload.ownerUserId, payload.roomId, payload.originalFilename, payload.storedFilename, payload.mimeType, payload.durationSeconds, payload.fileSize]);
        return result.rows[0];
    },
    async findById(songId) {
        const result = await pool.query('SELECT * FROM songs WHERE id = $1', [songId]);
        return result.rows[0] ?? null;
    },
    async assignToRoom(songId, roomId) {
        await pool.query('UPDATE songs SET room_id = $1, updated_at = NOW() WHERE id = $2', [roomId, songId]);
    },
};
