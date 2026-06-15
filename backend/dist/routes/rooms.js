"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const room_service_1 = require("../services/room.service");
const router = express_1.default.Router();
router.post('/', auth_1.requireAuth, async (req, res, next) => {
    try {
        const result = await room_service_1.roomService.createRoom(req.user.sub);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
router.post('/join', auth_1.requireAuth, async (req, res, next) => {
    try {
        const result = await room_service_1.roomService.joinRoom(req.user.sub, req.body.roomCode);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', auth_1.requireAuth, async (req, res, next) => {
    try {
        const roomId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const result = await room_service_1.roomService.getRoom(roomId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
router.post('/:id/leave', auth_1.requireAuth, async (req, res, next) => {
    try {
        const roomId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const result = await room_service_1.roomService.leaveRoom(req.user.sub, roomId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
