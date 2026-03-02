import {
  DecoratorParams,
  fetchDecoratorHtml,
  injectDecoratorServerSide,
} from '@navikt/nav-dekoratoren-moduler/ssr';
import logger from './logger';
import { miljø } from './miljø';

type NaisEnv = 'prod' | 'dev';

const hentDekoratørConfig = () => {
  const env = process.env.ENV;
  if (env === undefined) {
    logger.error('Mangler miljø for dekoratøren');
    throw Error('Miljø kan ikke være undefined');
  }

  const dekoratørParams: DecoratorParams = {
    simple: true,
    redirectToApp: true,
    level: 'Level4',
  };

  return {
    env: miljø.erLokalt ? 'dev' : (env as NaisEnv),
    params: dekoratørParams,
  };
};

const getHtmlWithDecorator = (filePath: string) => {
  return injectDecoratorServerSide({
    ...hentDekoratørConfig(),
    filePath,
  });
};

export const injectDekoratorIHtml = async (html: string): Promise<string> => {
  const elementer = await fetchDecoratorHtml(hentDekoratørConfig());

  return html
    .replace('</head>', `${elementer.DECORATOR_HEAD_ASSETS}</head>`)
    .replace('<body>', `<body>${elementer.DECORATOR_HEADER}`)
    .replace('</body>', `${elementer.DECORATOR_FOOTER}${elementer.DECORATOR_SCRIPTS}</body>`);
};

export default getHtmlWithDecorator;
