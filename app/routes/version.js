import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  res.send({ version: "1.0.0" });
});

export default routes;
