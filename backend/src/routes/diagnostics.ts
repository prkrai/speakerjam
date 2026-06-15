import express from 'express';
import { getSyncDiagnostics } from '../services/playback.service';

const router = express.Router();

router.get('/sync', (_req, res) => {
  res.json(getSyncDiagnostics());
});

export default router;
