import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { v4 as uuid } from 'uuid';
import logger from './logger';

export const lagProxy = (targetUrl: string, context: string): RequestHandler => {
  return createProxyMiddleware({
    changeOrigin: true,
    logger,
    pathRewrite: (path: string) => path.replace(context, ''),
    secure: true,
    target: targetUrl,
  });
};

export const leggTilRequestInfo = (): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.headers['Nav-Consumer-Id'] = 'familie-ef-soknad';
    req.headers['nav-call-id'] = req.headers['x-correlation-id'] ?? uuid();
    next();
  };
};
