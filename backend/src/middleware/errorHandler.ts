import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, { stack: err.stack });

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Duplicate entry.' });
  }

  res.status(500).json({ error: 'Something went wrong.' });
};

export default errorHandler;