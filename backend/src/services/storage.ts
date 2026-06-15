import fs from 'fs';
import path from 'path';

export interface StorageProvider {
  saveFile(file: Express.Multer.File, folder: string): Promise<{ storedPath: string; originalName: string; size: number }>;
  readFile(storedPath: string): Promise<Buffer>;
  exists(storedPath: string): Promise<boolean>;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir = path.resolve(process.cwd(), 'uploads/audio');

  constructor() {
    fs.mkdirSync(this.baseDir, { recursive: true });
  }

  async saveFile(file: Express.Multer.File, folder: string): Promise<{ storedPath: string; originalName: string; size: number }> {
    const targetDir = path.join(this.baseDir, folder);
    fs.mkdirSync(targetDir, { recursive: true });
    const storedName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const storedPath = path.join(targetDir, storedName);
    fs.writeFileSync(storedPath, file.buffer);
    return { storedPath, originalName: file.originalname, size: file.size };
  }

  async readFile(storedPath: string): Promise<Buffer> {
    return fs.readFileSync(storedPath);
  }

  async exists(storedPath: string): Promise<boolean> {
    return fs.existsSync(storedPath);
  }
}
