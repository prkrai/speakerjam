import express from 'express';
import { requireAuth } from '../middleware/auth';
import { roomService } from '../services/room.service';

const router = express.Router();

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const result = await roomService.createRoom((req as any).user.sub);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/join', requireAuth, async (req, res, next) => {
  try {
    const result = await roomService.joinRoom((req as any).user.sub, req.body.roomCode);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const roomId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await roomService.getRoom(roomId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/leave', requireAuth, async (req, res, next) => {
  try {
    const roomId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await roomService.leaveRoom((req as any).user.sub, roomId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
