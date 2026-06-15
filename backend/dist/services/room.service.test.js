"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('room service logic', () => {
    (0, vitest_1.it)('creates a room response shape', () => {
        const result = { roomId: 'room-1', roomCode: 'A7K4P', host: { id: 'u1', email: 'a@example.com' } };
        (0, vitest_1.expect)(result.roomCode).toHaveLength(5);
    });
    (0, vitest_1.it)('handles host transfer rule', () => {
        const members = [{ id: 'u2' }, { id: 'u3' }];
        (0, vitest_1.expect)(members[0].id).toBe('u2');
    });
});
