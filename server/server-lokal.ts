import express from 'express';

import routes from './routes';
import cookieParser from 'cookie-parser';
import { cspString } from './csp';
import webpack from 'webpack';
// @ts-ignore
import config from '../../config/webpack.run.js';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const app = express();

app.use((_req, res, next) => {
  res.header('Content-Security-Policy', cspString());
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  next();
});

const compiler = webpack(config);

if (!compiler) {
  throw new Error('Webpack compiler kunne ikke opprettes, mangler verdi.');
}

const middleware = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  writeToDisk: true,
  index: false, // Får dekoratøren på forsiden
});

app.use(middleware);
app.use(cookieParser());
app.use(webpackHotMiddleware(compiler));

app.use(routes(app));

console.log('Startet - lytter på port 3000');
app.listen(3000);
