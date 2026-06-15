"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const song_service_1 = require("../services/song.service");
const index_1 = require("../socket/index");
const router = express_1.default.Router();
router.post('/upload', auth_1.requireAuth, song_service_1.songService.uploadMiddleware, async (req, res, next) => {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).json({ success: false, message: 'Audio file is required' });
        const result = await song_service_1.songService.uploadSong(file, req.user.sub, req.body?.roomId ?? null);
        index_1.ioInstance?.emit('song_uploaded', { songId: result.id, roomId: result.room_id });
        res.status(201).json({ success: true, song: result });
    }
    catch (error) {
        next(error);
    }
});
router.post('/rooms/:roomId/song', auth_1.requireAuth, async (req, res, next) => {
    try {
        const roomId = Array.isArray(req.params.roomId) ? req.params.roomId[0] : req.params.roomId;
        const songId = typeof req.body?.songId === 'string' ? req.body.songId : undefined;
        if (!songId)
            return res.status(400).json({ success: false, message: 'songId is required' });
        const result = await song_service_1.songService.assignSong(songId, roomId);
        index_1.ioInstance?.emit('song_assigned', result);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        next(error);
    }
});
router.get('/', auth_1.requireAuth, async (req, res, next) => {
    try {
        const songs = await song_service_1.songService.getSongs();
        res.status(200).json(songs);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', auth_1.requireAuth, async (req, res, next) => {
    try {
        const songId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const song = await song_service_1.songService.getSong(songId);
        res.status(200).json({ success: true, song });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id/file', auth_1.requireAuth, async (req, res, next) => {
    try {
        const songId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { song, buffer } = await song_service_1.songService.streamSong(songId);
        res.setHeader('Content-Type', song.mime_type || 'audio/mpeg');
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Accept-Ranges', 'bytes');
        res.status(200).send(buffer);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
