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

const port = parseInt(process.env.API_PORT!, 10) || 7000;
const dev = process.env.NODE_ENV !== 'production';

const app = express();

app.set('trust proxy', !dev);
app.disable('x-powered-by');

// Global middleware
app.use(morgan(dev ? 'dev' : 'combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());

// Rate limiting middleware
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: dev ? Number.MAX_SAFE_INTEGER : 100, // limit each IP to x requests per windowMs
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  }),
);

const router = express.Router();

app.use('/', router);

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

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});
