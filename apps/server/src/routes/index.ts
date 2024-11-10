import express from 'express';
import status from 'http-status';

import { PixelTrackingRepository } from '@mail/db/repositories';
import { sendNotificationEmail } from '@mail/server/utils';
import type { EmailMetadata } from '@mail/extension/types';

const router: express.IRouter = express.Router();

const db = new PixelTrackingRepository();

router.get('/pixels/:id', async (req, res) => {
  // TODO(gashon) send notification email on first open
  const count = await db.countViews(req.params.id);
  if (count == 0) {
    const emailMetadata = await db.findByPixelId(req.params.id);
    if (emailMetadata) await sendNotificationEmail(emailMetadata);
    // TODO(gashon) alert on failed or missing email send
  }

  db.insertView(req.params.id);

  res.status(status.OK).json({ status: 'ok' });
});

router.put('/pixels', (req, res) => {
  const body = req.body as EmailMetadata;
  db.insert(body);

  res.status(status.CREATED).json({ pixelId: body.pixelId });
});

export default router;
