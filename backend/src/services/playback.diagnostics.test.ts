import { describe, expect, it } from 'vitest';
import { getSyncDiagnostics, recordPlaybackMetric } from './playback.service';

describe('playback diagnostics', () => {
  it('stores and averages playback metrics', () => {
    recordPlaybackMetric({
      scheduledStartTime: '2026-06-15T10:00:00.000Z',
      actualStartTime: '2026-06-15T10:00:00.020Z',
      clockOffset: 4,
      rtt: 12,
      startErrorMs: 20,
    });

    recordPlaybackMetric({
      scheduledStartTime: '2026-06-15T10:00:01.000Z',
      actualStartTime: '2026-06-15T10:00:01.010Z',
      clockOffset: -2,
      rtt: 8,
      startErrorMs: 10,
    });

    const diagnostics = getSyncDiagnostics();

    expect(diagnostics.sessions).toHaveLength(2);
    expect(diagnostics.averageOffset).toBe(1);
    expect(diagnostics.averageRtt).toBe(10);
    expect(diagnostics.averageStartError).toBe(15);
  });
});
