import express from 'express';
import bodyParser from 'body-parser';
import cors from './middleware/cors';

import mongoose from './db/mongoose';
import routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use(cors);

app.use('/version', routes.version);
app.use('/users', routes.users);
app.use('/collections', routes.collections);
app.use('/types', routes.types);
app.use('/items', routes.items);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
