"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomService = void 0;
const auth_repository_1 = require("./auth.repository");
const room_repository_1 = require("./room.repository");
exports.roomService = {
    async createRoom(userId) {
        const room = await room_repository_1.roomRepository.createRoom(userId);
        const host = await auth_repository_1.authRepository.findById(room.host_user_id);
        return { roomId: room.id, roomCode: room.room_code, host: { id: host.id, email: host.email } };
    },
    async joinRoom(userId, roomCode) {
        const room = await room_repository_1.roomRepository.findRoomByCode(roomCode);
        if (!room)
            throw Object.assign(new Error('Room not found'), { statusCode: 404 });
        const joined = await room_repository_1.roomRepository.joinRoom(room.id, userId);
        if (!joined)
            throw Object.assign(new Error('Already a member'), { statusCode: 409 });
        return { roomId: room.id, roomCode: room.room_code };
    },
    async leaveRoom(userId, roomId) {
        return room_repository_1.roomRepository.leaveRoom(roomId, userId);
    },
    async getRoom(roomId) {
        const room = await room_repository_1.roomRepository.findRoomById(roomId);
        if (!room)
            throw Object.assign(new Error('Room not found'), { statusCode: 404 });
        const host = await auth_repository_1.authRepository.findById(room.host_user_id);
        const members = await room_repository_1.roomRepository.findMembers(roomId);
        return { roomId: room.id, roomCode: room.room_code, host: { id: host.id, email: host.email }, members };
    },
};
