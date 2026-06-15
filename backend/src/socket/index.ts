import { Server, Socket } from 'socket.io';
import { registerRoomSocket } from './roomEvents';
import { calculateClockSync, getSyncDiagnostics, logPlaybackEvent, recordPlaybackMetric } from '../services/playback.service';

export let ioInstance: Server | null = null;

export function setSocketServer(io: Server) {
  ioInstance = io;
}

export function registerSocketHandlers(io: Server) {
  setSocketServer(io);
  registerRoomSocket(io);
  io.on('connection', (socket: Socket) => {
    socket.on('clock_sync', (payload) => {
      const t1 = Number(payload?.t1 ?? Date.now());
      const t2 = Date.now();
      const t3 = Date.now();
      const t4 = Date.now();
      const { offsetMs, rttMs } = calculateClockSync(t1, t2, t3, t4);
      logPlaybackEvent('CLOCK_SYNC', { offsetMs, rttMs, serverTime: t3 });
      socket.emit('clock_sync', { offsetMs, rttMs, serverTime: t3 });
    });

    socket.on('playback_scheduled', (payload) => {
      const startAt = Date.now() + 5000;
      logPlaybackEvent('PLAYBACK_SCHEDULED', { songId: payload?.songId, startAt });
      io.emit('playback_scheduled', { songId: payload?.songId, startAt });
    });

    socket.on('sync_diagnostics', () => {
      const diagnostics = getSyncDiagnostics();
      socket.emit('sync_diagnostics', {
        rtt: diagnostics.averageRtt,
        offset: diagnostics.averageOffset,
        lastStartError: diagnostics.sessions.at(-1)?.startErrorMs ?? 0,
        syncHealth: diagnostics.averageStartError <= 20 ? 'good' : 'needs-improvement',
      });
    });

    socket.on('play', (payload) => {
      const startAt = Date.now() + 5000;
      logPlaybackEvent('PLAYBACK_STARTED', { songId: payload?.songId, startAt });
      io.emit('play', { ...payload, startAt });
    });

    socket.on('playback_started', (payload) => {
      recordPlaybackMetric({
        scheduledStartTime: payload?.scheduledStartTime ?? new Date().toISOString(),
        actualStartTime: payload?.actualStartTime ?? new Date().toISOString(),
        clockOffset: Number(payload?.clockOffset ?? 0),
        rtt: Number(payload?.rtt ?? 0),
        startErrorMs: Number(payload?.startErrorMs ?? 0),
      });
      logPlaybackEvent('PLAYBACK_STARTED', payload);
      io.emit('playback_started', payload);
    });

    socket.on('start_error', (payload) => {
      logPlaybackEvent('START_ERROR', payload);
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
