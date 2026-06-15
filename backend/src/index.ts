import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import authRoutes from './routes/auth';
import roomRoutes from './routes/rooms';
import songRoutes from './routes/songs';
import diagnosticsRoutes from './routes/diagnostics';
import { registerSocketHandlers, setSocketServer } from './socket/index';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'syncjam-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/songs', songRoutes);
app.use('/diagnostics', diagnosticsRoutes);

setSocketServer(io);
registerSocketHandlers(io);

const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => {
  console.log(`SyncJam backend listening on http://localhost:${PORT}`);
});
