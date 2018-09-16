'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import cors from './middleware/cors';
import swaggerUi from 'swagger-ui-express';
import compression from 'compression';

import './db/mongoose';
import routes from './routes';

const app = express();

app.use(compression());

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({ limit: '50mb'}));
app.use(cors);

const base = '/api';
app.use(`${base}/version`, routes.version);
app.use(`${base}/users`, routes.users);
app.use(`${base}/collections`, routes.collections);
app.use(`${base}/types`, routes.types);
app.use(`${base}/items`, routes.items);
app.use(`${base}/statistics`, routes.statistics);

const swaggerDocument = require('./docs/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('*', function(req, res, next) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
