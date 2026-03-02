import express from 'express';
import { createServer as createViteServer } from 'vite';
import { sikkerhetsheadere } from './sikkerhetsheadere';
import { lagRoutes } from './routes';

const startServer = async () => {
  const app = express();

  app.use(sikkerhetsheadere());

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

  app.use(lagRoutes(vite));

  app.listen(3000, () => {
    console.log('http://localhost:3000/familie/alene-med-barn/soknad/');
  });
};

startServer();
