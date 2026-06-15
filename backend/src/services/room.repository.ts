import { Pool } from 'pg';
import { env } from '../config/env';

const pool = new Pool({ connectionString: env.postgresUrl });

function randomCode(length = 5) {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export const roomRepository = {
  async createRoom(hostUserId: string) {
    let roomCode = randomCode();
    let exists = true;
    while (exists) {
      const result = await pool.query('SELECT 1 FROM rooms WHERE room_code = $1', [roomCode]);
      exists = result.rowCount !== 0;
      if (exists) roomCode = randomCode();
    }

    const room = await pool.query(
      'INSERT INTO rooms (room_code, host_user_id) VALUES ($1, $2) RETURNING id, room_code, host_user_id, created_at, updated_at',
      [roomCode, hostUserId],
    );

    await pool.query('INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)', [room.rows[0].id, hostUserId]);
    return room.rows[0];
  },

  async findRoomById(roomId: string) {
    return (await pool.query('SELECT * FROM rooms WHERE id = $1', [roomId])).rows[0] ?? null;
  },

  async findRoomByCode(roomCode: string) {
    return (await pool.query('SELECT * FROM rooms WHERE room_code = $1', [roomCode])).rows[0] ?? null;
  },

  async findMembers(roomId: string) {
    return (await pool.query(
      'SELECT u.id, u.email FROM room_members rm JOIN users u ON u.id = rm.user_id WHERE rm.room_id = $1 ORDER BY rm.joined_at ASC',
      [roomId],
    )).rows;
  },

  async joinRoom(roomId: string, userId: string) {
    const existing = await pool.query('SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2', [roomId, userId]);
    if (existing.rowCount) return null;
    await pool.query('INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)', [roomId, userId]);
    return true;
  },

  async leaveRoom(roomId: string, userId: string) {
    await pool.query('DELETE FROM room_members WHERE room_id = $1 AND user_id = $2', [roomId, userId]);
    const members = await this.findMembers(roomId);
    const room = await this.findRoomById(roomId);

    if (!room) return { deleted: true, newHostId: null };

    if (room.host_user_id === userId && members.length > 0) {
      const newHostId = members[0].id;
      await pool.query('UPDATE rooms SET host_user_id = $1, updated_at = NOW() WHERE id = $2', [newHostId, roomId]);
      return { deleted: false, newHostId };
    }

    if (members.length === 0) {
      await pool.query('DELETE FROM rooms WHERE id = $1', [roomId]);
      return { deleted: true, newHostId: null };
    }

    return { deleted: false, newHostId: room.host_user_id };
  },
};
