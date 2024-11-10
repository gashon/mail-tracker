import express from 'express';
import status from 'http-status';

import { PixelTrackingRepository } from '@mail/db/repositories';
import type { EmailMetadata } from '@mail/extension/types';

const router: express.IRouter = express.Router();

const db = new PixelTrackingRepository();

db.insert({
  pixelId: '123',
  subject: 'Test',
  timestamp: Date.now(),
  to: ['gashon@ghussein.org'],
});

router.get('/pixels/:id', (req, res) => {
  console.log('tracking pixel');
  res.status(status.OK).send('Pixel tracking');
});

router.put('/pixels', (req, res) => {
  const body = req.body as EmailMetadata;
  db.insert(body);
  console.log('created pixel', req.body);
  res.status(status.CREATED).json({ pixelId: body.pixelId });
});

export default router;
