import express, { Express, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import getHtmlWithDecorator, { injectDekoratorIHtml } from './decorator';
import logger from './logger';
import { addRequestInfo, doProxy } from './proxy';
import attachToken from './tokenProxy';
import { miljø } from './miljø';
import type { ViteDevServer } from 'vite';

const erUtvikling = process.env.NODE_ENV === 'development';
const buildPath = path.join(process.cwd(), '../build');
const EF_BASE_PATH = '/familie/alene-med-barn';
const BASE_PATH = `${EF_BASE_PATH}/soknad`;

const routes = (app: Express, vite?: ViteDevServer) => {
  const expressRouter = express.Router();
  console.log('Setter opp routes');

  app.get(
    [`${BASE_PATH}/internal/isAlive`, `${BASE_PATH}/internal/isReady`],
    (_req: Request, res: Response) => {
      res.status(200).end();
    }
  );

  if (!erUtvikling) {
    expressRouter.use(BASE_PATH, express.static(buildPath, { index: false }));
  }

  expressRouter.use(/^(?!.*\/(internal|static|api)\/).*$/, async (_req, res) => {
    try {
      if (erUtvikling && vite) {
        const råHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        const transformertHtml = await vite.transformIndexHtml(_req.originalUrl, råHtml);
        const html = await injectDekoratorIHtml(transformertHtml);
        res.send(html);
      } else {
        const html = await getHtmlWithDecorator(path.join(buildPath, 'index.html'));
        res.send(html);
      }
    } catch (e) {
      logger.error(e);
      res.status(500).send(e);
    }
  });

  expressRouter.use(
    `${BASE_PATH}/api`,
    addRequestInfo(),
    attachToken('familie-ef-soknad-api'),
    doProxy(miljø.apiUrl, `${BASE_PATH}/api`)
  );

  expressRouter.use(
    `${BASE_PATH}/dokument`,
    addRequestInfo(),
    attachToken('familie-dokument'),
    doProxy(miljø.dokumentUrl, `${BASE_PATH}/dokument`)
  );

  return expressRouter;
};

export default routes;
