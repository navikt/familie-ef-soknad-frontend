import express from 'express';

import routes from './routes';
import { cspString } from './csp';
const app = express();

app.use((_req, res, next) => {
  res.header('Content-Security-Policy', cspString());
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  next();
});
app.use(routes(app));

app.listen(8080);
