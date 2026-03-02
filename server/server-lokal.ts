import express from 'express';
import { createServer as createViteServer } from 'vite';

import routes from './routes';
import cookieParser from 'cookie-parser';
import { cspString } from './csp';

const startServer = async () => {
  const app = express();

  app.use((_req, res, next) => {
    res.header('Content-Security-Policy', cspString());
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    next();
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use((req, res, next) => {
    const originalUrl = req.url;
    vite.middlewares(req, res, () => {
      req.url = originalUrl;
      next();
    });
  });
  app.use(cookieParser());
  app.use(routes(app, vite));

  console.log('Startet - lytter på port 3000');
  app.listen(3000);
};

startServer();
