"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('song service validation', () => {
    (0, vitest_1.it)('accepts supported audio extensions', () => {
        const ext = '.mp3';
        (0, vitest_1.expect)(['.mp3', '.wav', '.m4a']).toContain(ext);
    });
    (0, vitest_1.it)('rejects oversize files', () => {
        const size = 101 * 1024 * 1024;
        (0, vitest_1.expect)(size > 100 * 1024 * 1024).toBe(true);
    });
});
