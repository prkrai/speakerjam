import multer from 'multer';
import { LocalStorageProvider } from './storage';
import { songRepository } from './song.repository';

const storage = new LocalStorageProvider();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

const allowedMime = new Set(['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/aac']);
const allowedExt = new Set(['.mp3', '.wav', '.m4a']);

function validateFile(file: Express.Multer.File) {
  if (!file || !file.originalname) throw Object.assign(new Error('Invalid file'), { statusCode: 400 });
  const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
  if (!allowedExt.has(ext)) throw Object.assign(new Error('Unsupported file extension'), { statusCode: 400 });
  if (!allowedMime.has(file.mimetype)) throw Object.assign(new Error('Unsupported MIME type'), { statusCode: 400 });
  if (file.size > 100 * 1024 * 1024) throw Object.assign(new Error('File exceeds 100 MB limit'), { statusCode: 400 });
}

function extractDuration(file: Express.Multer.File) {
  return Math.max(1, Math.floor(file.size / 16000));
}

export const songService = {
  uploadMiddleware: upload.single('audio'),
  async uploadSong(file: Express.Multer.File, ownerUserId: string, roomId?: string | null) {
    validateFile(file);
    const saved = await storage.saveFile(file, 'uploads');
    const durationSeconds = extractDuration(file);
    const record = await songRepository.createSong({
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

  async getSong(songId: string) {
    return songRepository.findById(songId);
  },

  async assignSong(songId: string, roomId: string) {
    await songRepository.assignToRoom(songId, roomId);
    return { songId, roomId };
  },

  async streamSong(songId: string) {
    const song = await songRepository.findById(songId);
    if (!song) throw Object.assign(new Error('Song not found'), { statusCode: 404 });
    return { song, buffer: await storage.readFile(song.stored_filename) };
  },
};
