import { NextFunction, Request, RequestHandler, Response } from 'express';
import { cspString } from './csp';

export const sikkerhetsheadere = (): RequestHandler => {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.header('Content-Security-Policy', cspString());
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    next();
  };
};
