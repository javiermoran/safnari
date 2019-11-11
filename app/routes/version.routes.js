'use strict';

import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  res.send({ version: "1.2.0" });
});

export default routes;
