import express from 'express';
import status from 'http-status';

import { PixelTrackingRepository } from '@mail/db/repositories';
import type { EmailMetadata } from '@mail/extension/types';

const router: express.IRouter = express.Router();

const db = new PixelTrackingRepository();

db.upsert({
  pixelId: '123',
  subject: 'Test',
  timestamp: Date.now(),
  to: ['gashon@ghussein.org'],
});

router.get('/pixels/:id', async (req, res) => {
  console.log('tracking pixel');
  const pixel = await db.findByPixelId(req.params.id);
  console.log(pixel);
  res.status(status.OK).send('Pixel tracking');
});

router.put('/pixels', (req, res) => {
  const body = req.body as EmailMetadata;
  db.insert(body);

  // TODO(gashon) send notification email on first open

  res.status(status.CREATED).json({ pixelId: body.pixelId });
});

export default router;
