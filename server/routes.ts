import express from 'express';
import path from 'path';
import getHtmlWithDecorator from './decorator';
import logger from './logger';
import { addRequestInfo, doProxy } from './proxy';
import attachToken from './tokenProxy';
import { miljø } from './miljø';

const buildPath =
  process.env.NODE_ENV !== 'development'
    ? path.join(process.cwd(), '../build')
    : path.join(process.cwd(), 'dev-build');
const EF_BASE_PATH = '/familie/alene-med-barn';
const BASE_PATH = `${EF_BASE_PATH}/soknad`;
const routes = () => {
  const expressRouter = express.Router();
  console.log('Setter opp routes');

  expressRouter.get(`${BASE_PATH}/internal/isAlive|isReady`, (req, res) =>
    res.sendStatus(200)
  );

  expressRouter.use(BASE_PATH, express.static(buildPath, { index: false }));

  expressRouter.use(/^(?!.*\/(internal|static|api)\/).*$/, (req, res) => {
    getHtmlWithDecorator(path.join(buildPath, 'index.html'))
      .then((html) => {
        res.send(html);
      })
      .catch((e) => {
        logger.error(e);
        res.status(500).send(e);
      });
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
