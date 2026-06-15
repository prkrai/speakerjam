import { describe, expect, it } from 'vitest';
import { calculateClockSync, schedulePlayback } from './playback.service';

describe('playback service', () => {
  it('calculates clock offset and RTT', () => {
    const result = calculateClockSync(100, 120, 130, 160);
    expect(result.offsetMs).toBe(-5);
    expect(result.rttMs).toBe(50);
  });

  it('schedules playback at server time + 5000ms', () => {
    const result = schedulePlayback(1000, 'song-1');
    expect(result.startAt).toBe(6000);
  });
});
