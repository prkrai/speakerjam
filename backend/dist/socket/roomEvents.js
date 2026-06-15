"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoomSocket = registerRoomSocket;
function registerRoomSocket(io) {
    io.on('connection', (socket) => {
        socket.on('room_created', (payload) => io.emit('room_created', payload));
        socket.on('room_joined', (payload) => io.emit('room_joined', payload));
        socket.on('room_left', (payload) => io.emit('room_left', payload));
        socket.on('member_joined', (payload) => io.emit('member_joined', payload));
        socket.on('member_left', (payload) => io.emit('member_left', payload));
        socket.on('host_changed', (payload) => io.emit('host_changed', payload));
        socket.on('room_deleted', (payload) => io.emit('room_deleted', payload));
    });
}
