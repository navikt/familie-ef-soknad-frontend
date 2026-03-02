import express from 'express';
import { sikkerhetsheadere } from './sikkerhetsheadere';
import { lagRoutes } from './routes';

const app = express();

app.use(sikkerhetsheadere());
app.use(lagRoutes());

app.listen(8080);
