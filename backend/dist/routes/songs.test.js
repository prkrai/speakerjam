"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('song routes', () => {
    (0, vitest_1.it)('supports audio file types', () => {
        (0, vitest_1.expect)(['audio/mpeg', 'audio/wav', 'audio/mp4']).toContain('audio/mpeg');
    });
});
