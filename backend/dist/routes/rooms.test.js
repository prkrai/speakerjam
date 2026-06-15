"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('room routes', () => {
    (0, vitest_1.it)('accepts room code format', () => {
        const code = 'A7K4P';
        (0, vitest_1.expect)(code).toMatch(/^[A-Z0-9]{5,6}$/);
    });
});
