import express from 'express';
import { requireAuth } from '../middleware/auth';
import { songService } from '../services/song.service';
import { ioInstance } from '../socket/index';

const router = express.Router();

router.post('/upload', requireAuth, songService.uploadMiddleware, async (req, res, next) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ success: false, message: 'Audio file is required' });
    const result = await songService.uploadSong(file, (req as any).user.sub, req.body?.roomId ?? null);
    ioInstance?.emit('song_uploaded', { songId: result.id, roomId: result.room_id });
    res.status(201).json({ success: true, song: result });
  } catch (error) {
    next(error);
  }
});

router.post('/rooms/:roomId/song', requireAuth, async (req, res, next) => {
  try {
    const roomId = Array.isArray(req.params.roomId) ? req.params.roomId[0] : req.params.roomId;
    const songId = typeof req.body?.songId === 'string' ? req.body.songId : undefined;
    if (!songId) return res.status(400).json({ success: false, message: 'songId is required' });
    const result = await songService.assignSong(songId, roomId);
    ioInstance?.emit('song_assigned', result);
    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const songId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const song = await songService.getSong(songId);
    res.status(200).json({ success: true, song });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/file', requireAuth, async (req, res, next) => {
  try {
    const songId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { song, buffer } = await songService.streamSong(songId);
    res.setHeader('Content-Type', song.mime_type || 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Accept-Ranges', 'bytes');
    res.status(200).send(buffer);
  } catch (error) {
    next(error);
  }
});

export default router;
