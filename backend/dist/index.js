"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const auth_1 = __importDefault(require("./routes/auth"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const songs_1 = __importDefault(require("./routes/songs"));
const diagnostics_1 = __importDefault(require("./routes/diagnostics"));
const index_1 = require("./socket/index");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'syncjam-backend' });
});
app.use('/api/auth', auth_1.default);
app.use('/api/rooms', rooms_1.default);
app.use('/api/songs', songs_1.default);
app.use('/diagnostics', diagnostics_1.default);
(0, index_1.setSocketServer)(io);
(0, index_1.registerSocketHandlers)(io);
const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => {
    console.log(`SyncJam backend listening on http://localhost:${PORT}`);
});
