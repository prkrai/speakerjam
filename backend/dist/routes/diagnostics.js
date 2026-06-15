"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playback_service_1 = require("../services/playback.service");
const router = express_1.default.Router();
router.get('/sync', (_req, res) => {
    res.json((0, playback_service_1.getSyncDiagnostics)());
});
exports.default = router;
