import express from 'express';
import status from 'http-status';

import { PixelTrackingRepository } from '@mail/db/repositories';
import { sendNotificationEmail } from '@mail/server/utils';
import type { EmailMetadata } from '@mail/extension/types';

const router: express.IRouter = express.Router();

const db = new PixelTrackingRepository();

router.get('/pixels/:id', async (req, res) => {
  const count = await db.countViews(req.params.id);
  console.log('HIT', count);

  // Note: GMail sends a request on send. Need to take the second count
  if (count == 1) {
    console.log('sending email!!');
    try {
      const emailMetadata = await db.findByPixelId(req.params.id);
      if (emailMetadata) await sendNotificationEmail(emailMetadata);
    } catch (error) {
      // TODO(gashon) alert on failed or missing email send
      console.error('Error sending email:', error);
    }
  }

  db.insertView(req.params.id);

  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  //  1x1 transparent GIF in base64
  const pixel = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64',
  );
  res.sendFile('/home/gashon/Downloads/prog.jpeg');
  // res.end(pixel, 'binary');
});

router.put('/pixels', (req, res) => {
  const body = req.body as EmailMetadata;
  db.insert(body);

  res.status(status.CREATED).json({ pixelId: body.pixelId });
});

export default router;
