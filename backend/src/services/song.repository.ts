import { Pool } from 'pg';
import { env } from '../config/env';

const pool = new Pool({ connectionString: env.postgresUrl });

export const songRepository = {
  async createSong(payload: {
    ownerUserId: string;
    roomId: string | null;
    originalFilename: string;
    storedFilename: string;
    mimeType: string;
    durationSeconds: number;
    fileSize: number;
  }) {
    const result = await pool.query(
      `INSERT INTO songs (owner_user_id, room_id, original_filename, stored_filename, mime_type, duration_seconds, file_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [payload.ownerUserId, payload.roomId, payload.originalFilename, payload.storedFilename, payload.mimeType, payload.durationSeconds, payload.fileSize],
    );
    return result.rows[0];
  },

  async findById(songId: string) {
    const result = await pool.query('SELECT * FROM songs WHERE id = $1', [songId]);
    return result.rows[0] ?? null;
  },

  async assignToRoom(songId: string, roomId: string) {
    await pool.query('UPDATE songs SET room_id = $1, updated_at = NOW() WHERE id = $2', [roomId, songId]);
  },

  async findAll() {
    const result = await pool.query('SELECT * FROM songs ORDER BY created_at DESC');
    return result.rows;
  },
};
