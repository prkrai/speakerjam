"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateClockSync = calculateClockSync;
exports.schedulePlayback = schedulePlayback;
exports.recordPlaybackMetric = recordPlaybackMetric;
exports.getSyncDiagnostics = getSyncDiagnostics;
exports.resetPlaybackDiagnostics = resetPlaybackDiagnostics;
exports.logPlaybackEvent = logPlaybackEvent;
const playbackMetrics = [];
function calculateClockSync(t1, t2, t3, t4) {
    const roundTripDelay = (t4 - t1) - (t3 - t2);
    const offsetMs = ((t2 - t1) + (t3 - t4)) / 2;
    return { offsetMs, rttMs: Math.max(roundTripDelay, 0) };
}
function schedulePlayback(serverTime, songId) {
    return {
        songId,
        startAt: serverTime + 5000,
    };
}
function recordPlaybackMetric(metric) {
    playbackMetrics.push({
        scheduledStartTime: metric.scheduledStartTime ?? new Date(0).toISOString(),
        actualStartTime: metric.actualStartTime ?? new Date().toISOString(),
        clockOffset: Number(metric.clockOffset ?? 0),
        rtt: Number(metric.rtt ?? 0),
        startErrorMs: Number(metric.startErrorMs ?? 0),
    });
    return playbackMetrics[playbackMetrics.length - 1];
}
function getSyncDiagnostics() {
    if (playbackMetrics.length === 0) {
        return {
            averageOffset: 0,
            averageRtt: 0,
            averageStartError: 0,
            sessions: [],
        };
    }
    const averageOffset = playbackMetrics.reduce((sum, session) => sum + session.clockOffset, 0) / playbackMetrics.length;
    const averageRtt = playbackMetrics.reduce((sum, session) => sum + session.rtt, 0) / playbackMetrics.length;
    const averageStartError = playbackMetrics.reduce((sum, session) => sum + session.startErrorMs, 0) / playbackMetrics.length;
    return {
        averageOffset,
        averageRtt,
        averageStartError,
        sessions: [...playbackMetrics],
    };
}
function resetPlaybackDiagnostics() {
    playbackMetrics.length = 0;
}
function logPlaybackEvent(event, details) {
    console.log(`[${event}] ${new Date().toISOString()} ${JSON.stringify(details)}`);
}
