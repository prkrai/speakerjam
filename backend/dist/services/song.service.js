"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.songService = void 0;
const multer_1 = __importDefault(require("multer"));
const storage_1 = require("./storage");
const song_repository_1 = require("./song.repository");
const storage = new storage_1.LocalStorageProvider();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });
const allowedMime = new Set(['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/aac']);
const allowedExt = new Set(['.mp3', '.wav', '.m4a']);
function validateFile(file) {
    if (!file || !file.originalname)
        throw Object.assign(new Error('Invalid file'), { statusCode: 400 });
    const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
    if (!allowedExt.has(ext))
        throw Object.assign(new Error('Unsupported file extension'), { statusCode: 400 });
    if (!allowedMime.has(file.mimetype))
        throw Object.assign(new Error('Unsupported MIME type'), { statusCode: 400 });
    if (file.size > 100 * 1024 * 1024)
        throw Object.assign(new Error('File exceeds 100 MB limit'), { statusCode: 400 });
}
function extractDuration(file) {
    return Math.max(1, Math.floor(file.size / 16000));
}
exports.songService = {
    uploadMiddleware: upload.single('audio'),
    async uploadSong(file, ownerUserId, roomId) {
        validateFile(file);
        const saved = await storage.saveFile(file, 'uploads');
        const durationSeconds = extractDuration(file);
        const record = await song_repository_1.songRepository.createSong({
            ownerUserId,
            roomId: roomId ?? null,
            originalFilename: file.originalname,
            storedFilename: saved.storedPath,
            mimeType: file.mimetype,
            durationSeconds,
            fileSize: file.size,
        });
        return record;
    },
    async getSong(songId) {
        return song_repository_1.songRepository.findById(songId);
    },
    async getSongs() {
        return song_repository_1.songRepository.findAll();
    },
    async assignSong(songId, roomId) {
        await song_repository_1.songRepository.assignToRoom(songId, roomId);
        return { songId, roomId };
    },
    async streamSong(songId) {
        const song = await song_repository_1.songRepository.findById(songId);
        if (!song)
            throw Object.assign(new Error('Song not found'), { statusCode: 404 });
        return { song, buffer: await storage.readFile(song.stored_filename) };
    },
};
