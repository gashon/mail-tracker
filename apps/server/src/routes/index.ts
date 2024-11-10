import express from 'express';
import status from 'http-status';

import { PixelTrackingRepository } from '@mail/db/repositories';
import type { EmailMetadata } from '@mail/extension/types';

const router: express.IRouter = express.Router();

const db = new PixelTrackingRepository();

router.get('/pixels/:id', async (req, res) => {
  db.insertView(req.params.id);
  res.status(status.OK).json({ status: 'ok' });
});

router.put('/pixels', (req, res) => {
  const body = req.body as EmailMetadata;
  db.insert(body);

  // TODO(gashon) send notification email on first open

  res.status(status.CREATED).json({ pixelId: body.pixelId });
});

export default router;
