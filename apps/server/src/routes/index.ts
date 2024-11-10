import express from 'express';
import status from 'http-status';

import type { EmailMetadata } from '@mail/extension/types';

const router: express.IRouter = express.Router();

router.get('/pixels/:id', (req, res) => {
  console.log('tracking pixel');
  res.status(status.OK).send('Pixel tracking');
});

router.put('/pixels', (req, res) => {
  const body = req.body as EmailMetadata;
  console.log('created pixel', req.body);
  res.status(status.CREATED).json({ pixelId: body.pixelId });
});

export default router;
