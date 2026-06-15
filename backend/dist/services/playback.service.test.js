"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const playback_service_1 = require("./playback.service");
(0, vitest_1.describe)('playback service', () => {
    (0, vitest_1.it)('calculates clock offset and RTT', () => {
        const result = (0, playback_service_1.calculateClockSync)(100, 120, 130, 160);
        (0, vitest_1.expect)(result.offsetMs).toBe(-5);
        (0, vitest_1.expect)(result.rttMs).toBe(50);
    });
    (0, vitest_1.it)('schedules playback at server time + 5000ms', () => {
        const result = (0, playback_service_1.schedulePlayback)(1000, 'song-1');
        (0, vitest_1.expect)(result.startAt).toBe(6000);
    });
});
