"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioInstance = void 0;
exports.setSocketServer = setSocketServer;
exports.registerSocketHandlers = registerSocketHandlers;
const roomEvents_1 = require("./roomEvents");
const playback_service_1 = require("../services/playback.service");
exports.ioInstance = null;
function setSocketServer(io) {
    exports.ioInstance = io;
}
function registerSocketHandlers(io) {
    setSocketServer(io);
    (0, roomEvents_1.registerRoomSocket)(io);
    io.on('connection', (socket) => {
        socket.on('clock_sync', (payload) => {
            const t1 = Number(payload?.t1 ?? Date.now());
            const t2 = Date.now();
            const t3 = Date.now();
            const t4 = Date.now();
            const { offsetMs, rttMs } = (0, playback_service_1.calculateClockSync)(t1, t2, t3, t4);
            (0, playback_service_1.logPlaybackEvent)('CLOCK_SYNC', { offsetMs, rttMs, serverTime: t3 });
            socket.emit('clock_sync', { offsetMs, rttMs, serverTime: t3 });
        });
        socket.on('playback_scheduled', (payload) => {
            const startAt = Date.now() + 5000;
            (0, playback_service_1.logPlaybackEvent)('PLAYBACK_SCHEDULED', { songId: payload?.songId, startAt });
            io.emit('playback_scheduled', { songId: payload?.songId, startAt });
        });
        socket.on('sync_diagnostics', () => {
            const diagnostics = (0, playback_service_1.getSyncDiagnostics)();
            socket.emit('sync_diagnostics', {
                rtt: diagnostics.averageRtt,
                offset: diagnostics.averageOffset,
                lastStartError: diagnostics.sessions.at(-1)?.startErrorMs ?? 0,
                syncHealth: diagnostics.averageStartError <= 20 ? 'good' : 'needs-improvement',
            });
        });
        socket.on('play', (payload) => {
            const startAt = Date.now() + 5000;
            (0, playback_service_1.logPlaybackEvent)('PLAYBACK_STARTED', { songId: payload?.songId, startAt });
            io.emit('play', { ...payload, startAt });
        });
        socket.on('playback_started', (payload) => {
            (0, playback_service_1.recordPlaybackMetric)({
                scheduledStartTime: payload?.scheduledStartTime ?? new Date().toISOString(),
                actualStartTime: payload?.actualStartTime ?? new Date().toISOString(),
                clockOffset: Number(payload?.clockOffset ?? 0),
                rtt: Number(payload?.rtt ?? 0),
                startErrorMs: Number(payload?.startErrorMs ?? 0),
            });
            (0, playback_service_1.logPlaybackEvent)('PLAYBACK_STARTED', payload);
            io.emit('playback_started', payload);
        });
        socket.on('start_error', (payload) => {
            (0, playback_service_1.logPlaybackEvent)('START_ERROR', payload);
            io.emit('start_error', payload);
        });
        socket.on('pause', (payload) => io.emit('pause', payload));
        socket.on('resume', (payload) => io.emit('resume', payload));
        socket.on('seek', (payload) => io.emit('seek', payload));
        socket.on('stop', (payload) => io.emit('stop', payload));
        socket.on('drift_detected', (payload) => {
            io.emit('drift_detected', payload);
        });
    });
}
