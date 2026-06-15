export type SyncEvent =
  | 'room_created'
  | 'room_joined'
  | 'room_left'
  | 'member_joined'
  | 'member_left'
  | 'song_uploaded'
  | 'play'
  | 'pause'
  | 'resume'
  | 'seek'
  | 'stop'
  | 'clock_sync'
  | 'drift_detected'
  | 'drift_corrected'
  | 'sync_status';

export interface ClockSyncPayload {
  t1: number;
}

export interface DriftReport {
  playbackPosition: number;
  deviceTime: number;
}
