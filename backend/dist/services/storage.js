"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProvider = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class LocalStorageProvider {
    constructor() {
        this.baseDir = path_1.default.resolve(process.cwd(), 'uploads/audio');
        fs_1.default.mkdirSync(this.baseDir, { recursive: true });
    }
    async saveFile(file, folder) {
        const targetDir = path_1.default.join(this.baseDir, folder);
        fs_1.default.mkdirSync(targetDir, { recursive: true });
        const storedName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        const storedPath = path_1.default.join(targetDir, storedName);
        fs_1.default.writeFileSync(storedPath, file.buffer);
        return { storedPath, originalName: file.originalname, size: file.size };
    }
    async readFile(storedPath) {
        return fs_1.default.readFileSync(storedPath);
    }
    async exists(storedPath) {
        return fs_1.default.existsSync(storedPath);
    }
}
exports.LocalStorageProvider = LocalStorageProvider;
