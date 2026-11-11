import express from 'express';
import { lagRoutes } from './routes';
import { sikkerhetsheadere } from './sikkerhetsheadere';

const app = express();

app.use(sikkerhetsheadere());
app.use(lagRoutes());

app.listen(8080);
