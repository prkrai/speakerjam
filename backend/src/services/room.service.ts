import { authRepository } from './auth.repository';
import { roomRepository } from './room.repository';

export const roomService = {
  async createRoom(userId: string) {
    const room = await roomRepository.createRoom(userId);
    const host = await authRepository.findById(room.host_user_id);
    return { roomId: room.id, roomCode: room.room_code, host: { id: host.id, email: host.email } };
  },

  async joinRoom(userId: string, roomCode: string) {
    const room = await roomRepository.findRoomByCode(roomCode);
    if (!room) throw Object.assign(new Error('Room not found'), { statusCode: 404 });
    const joined = await roomRepository.joinRoom(room.id, userId);
    if (!joined) throw Object.assign(new Error('Already a member'), { statusCode: 409 });
    return { roomId: room.id, roomCode: room.room_code };
  },

  async leaveRoom(userId: string, roomId: string) {
    return roomRepository.leaveRoom(roomId, userId);
  },

  async getRoom(roomId: string) {
    const room = await roomRepository.findRoomById(roomId);
    if (!room) throw Object.assign(new Error('Room not found'), { statusCode: 404 });
    const host = await authRepository.findById(room.host_user_id);
    const members = await roomRepository.findMembers(roomId);
    return { roomId: room.id, roomCode: room.room_code, host: { id: host.id, email: host.email }, members };
  },
};
