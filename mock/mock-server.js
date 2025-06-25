import express from 'express';
import dotenv from 'dotenv';
import mockPerson from './mocks/mockPerson.json' assert { type: 'json' };
import mockToggles from './mocks/mockToggles.json' assert { type: 'json' };
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = 8092;

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded());

app.get('/', function (req, res) {
  res.send('Test');
});

app.get('/api/innlogget', (req, res) => {
  res.status(200).json({});
});

app.get('/api/featuretoggle', (req, res) => {
  res.status(200).json(mockToggles);
});

app.get('/api/oppslag/sokerinfo', (req, res) => {
  res.status(200).json(mockPerson);
});

app.post('/api/soknad', (req, res) => {
  res.status(200).json({
    text: 'OK',
    mottattDato: '2022-01-01T01:01:01',
  });
});

let mellomlager = {};

app.get('/api/soknad/:stonadstype', (req, res) => {
  const stonadstype = req.params.stonadstype;
  const mellomlagretData = mellomlager[stonadstype];
  if (mellomlagretData) {
    res.status(200).json(mellomlagretData);
  } else {
    console.log(`Fant ikke mellomlagret ${stonadstype}`, Object.keys(mellomlager));
    res.sendStatus(404);
  }
});

app.post('/api/soknad/:stonadstype', (req, res) => {
  mellomlager[req.params.stonadstype] = req.body;
  res.status(200).json({});
});

app.delete('/api/soknad/:stonadstype', (req, res) => {
  delete mellomlager[req.params.stonadstype];
  res.status(200).json({});
});
app.post('/api/mapper/:noe', (req, res) => {
  res.status(200).json({
    dokumentId: new Date().toISOString(),
    filnavn: `filnavn-${new Date().toISOString()}`,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
