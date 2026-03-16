import express, { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import { hentHtmlMedDekoratør, injectDekoratørIHtml } from './decorator';
import logger from './logger';
import { leggTilRequestInfo, lagProxy } from './proxy';
import { leggTilToken } from './tokenProxy';
import { miljø } from './miljø';
import type { ViteDevServer } from 'vite';

const erUtvikling = process.env.NODE_ENV === 'development';
const buildPath = path.join(process.cwd(), '../build');
const EF_BASE_PATH = '/familie/alene-med-barn';
const BASE_PATH = `${EF_BASE_PATH}/soknad`;

const lagHelsesjekker = (): Router => {
  const router = express.Router();

  router.get(
    [`${BASE_PATH}/internal/isAlive`, `${BASE_PATH}/internal/isReady`],
    (_req: Request, res: Response) => {
      res.status(200).end();
    }
  );

  return router;
};

const lagApiProxyer = (): Router => {
  const router = express.Router();

  router.use(
    `${BASE_PATH}/api`,
    leggTilRequestInfo(),
    leggTilToken('familie-ef-soknad-api'),
    lagProxy(miljø.apiUrl, `${BASE_PATH}/api`)
  );

  router.use(
    `${BASE_PATH}/dokument`,
    leggTilRequestInfo(),
    leggTilToken('familie-dokument'),
    lagProxy(miljø.dokumentUrl, `${BASE_PATH}/dokument`)
  );

  return router;
};

const lagHtmlRouter = (vite?: ViteDevServer): Router => {
  const router = express.Router();

  if (!erUtvikling) {
    router.use(BASE_PATH, express.static(buildPath, { index: false }));
  }

  router.use(`${BASE_PATH}/{*path}`, async (_req: Request, res: Response) => {
    try {
      if (erUtvikling && vite) {
        const rawHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        const transformertHtml = await vite.transformIndexHtml(_req.originalUrl, rawHtml);
        const html = await injectDekoratørIHtml(transformertHtml);
        res.send(html);
      } else {
        const html = await hentHtmlMedDekoratør(path.join(buildPath, 'index.html'));
        res.send(html);
      }
    } catch (e) {
      logger.error(e);
      res.status(500).send('Noe gikk galt');
    }
  });

  return router;
};

export const lagRoutes = (vite?: ViteDevServer): Router => {
  const router = express.Router();

  router.use(lagHelsesjekker());
  router.use(lagApiProxyer());
  router.use(lagHtmlRouter(vite));

  return router;
};
