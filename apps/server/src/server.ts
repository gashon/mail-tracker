import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';

import logger from './lib/logger';
import router from './routes';

const PORT = 3_000;
const IS_DEV = process.env.NODE_ENV !== 'production';

const app: express.Application = express();

app.set('trust proxy', !IS_DEV);
app.disable('x-powered-by');

// Global middleware
app.use(morgan(IS_DEV ? 'dev' : 'combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());

// Rate limiting middleware
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: IS_DEV ? Number.MAX_SAFE_INTEGER : 100, // limit each IP to x requests per windowMs
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  }),
);

app.use('/api', router);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
  },
);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});
