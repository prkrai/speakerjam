"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
(0, vitest_1.describe)('auth routes', () => {
    (0, vitest_1.it)('rejects invalid payload', async () => {
        const res = await (0, supertest_1.default)(app).post('/auth/register').send({ email: 'bad', password: 'x' });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
});
