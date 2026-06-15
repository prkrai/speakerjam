export interface ClockSyncResult {
  offsetMs: number;
  rttMs: number;
}

export interface PlaybackMetricSession {
  scheduledStartTime: string;
  actualStartTime: string;
  clockOffset: number;
  rtt: number;
  startErrorMs: number;
}

export interface SyncDiagnosticsSummary {
  averageOffset: number;
  averageRtt: number;
  averageStartError: number;
  sessions: PlaybackMetricSession[];
}

const playbackMetrics: PlaybackMetricSession[] = [];

export function calculateClockSync(t1: number, t2: number, t3: number, t4: number): ClockSyncResult {
  const roundTripDelay = (t4 - t1) - (t3 - t2);
  const offsetMs = ((t2 - t1) + (t3 - t4)) / 2;
  return { offsetMs, rttMs: Math.max(roundTripDelay, 0) };
}

export function schedulePlayback(serverTime: number, songId: string) {
  return {
    songId,
    startAt: serverTime + 5000,
  };
}

export function recordPlaybackMetric(metric: PlaybackMetricSession) {
  playbackMetrics.push({
    scheduledStartTime: metric.scheduledStartTime ?? new Date(0).toISOString(),
    actualStartTime: metric.actualStartTime ?? new Date().toISOString(),
    clockOffset: Number(metric.clockOffset ?? 0),
    rtt: Number(metric.rtt ?? 0),
    startErrorMs: Number(metric.startErrorMs ?? 0),
  });
  return playbackMetrics[playbackMetrics.length - 1];
}

export function getSyncDiagnostics(): SyncDiagnosticsSummary {
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

export function resetPlaybackDiagnostics() {
  playbackMetrics.length = 0;
}

export function logPlaybackEvent(event: string, details: Record<string, unknown>) {
  console.log(`[${event}] ${new Date().toISOString()} ${JSON.stringify(details)}`);
}

