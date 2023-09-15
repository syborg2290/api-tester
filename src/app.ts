import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import compressFilter from './utils/compressFilter.util';
import config from './config/config';
import validationMiddleware from './middleware/validateRequest';

const bodyParser = require("body-parser");

const curlEndpoints = require('./routes/curlEndpoints');
const executeGoTests = require('./routes/executeGoTests');

const app: Express = express();

app.use(bodyParser.json());


app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    origin: [config.cors_origin],
    credentials: true,
  })
);

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

// Use the validationMiddleware globally for all routes
app.use(validationMiddleware);



app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/curl', curlEndpoints);
app.use('/libs', executeGoTests);


export default app;
