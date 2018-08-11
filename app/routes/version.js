import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  res.send({ version: "1.0.1" });
});

export default routes;
