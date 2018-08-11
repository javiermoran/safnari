import express from 'express';
import bodyParser from 'body-parser';
import cors from './middleware/cors';

import mongoose from './db/mongoose';
import routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use(cors);

const base = '/api';
app.use(`${base}/version`, routes.version);
app.use(`${base}/users`, routes.users);
app.use(`${base}/collections`, routes.collections);
app.use(`${base}/types`, routes.types);
app.use(`${base}/items`, routes.items);

app.listen(process.env.PORT, () => {
  console.log('Listening on port 3000');
});
