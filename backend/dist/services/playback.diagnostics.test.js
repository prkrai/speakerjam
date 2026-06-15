"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const playback_service_1 = require("./playback.service");
(0, vitest_1.describe)('playback diagnostics', () => {
    (0, vitest_1.it)('stores and averages playback metrics', () => {
        (0, playback_service_1.recordPlaybackMetric)({
            scheduledStartTime: '2026-06-15T10:00:00.000Z',
            actualStartTime: '2026-06-15T10:00:00.020Z',
            clockOffset: 4,
            rtt: 12,
            startErrorMs: 20,
        });
        (0, playback_service_1.recordPlaybackMetric)({
            scheduledStartTime: '2026-06-15T10:00:01.000Z',
            actualStartTime: '2026-06-15T10:00:01.010Z',
            clockOffset: -2,
            rtt: 8,
            startErrorMs: 10,
        });
        const diagnostics = (0, playback_service_1.getSyncDiagnostics)();
        (0, vitest_1.expect)(diagnostics.sessions).toHaveLength(2);
        (0, vitest_1.expect)(diagnostics.averageOffset).toBe(1);
        (0, vitest_1.expect)(diagnostics.averageRtt).toBe(10);
        (0, vitest_1.expect)(diagnostics.averageStartError).toBe(15);
    });
});
