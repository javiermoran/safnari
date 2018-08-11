import { Router } from 'express';
import Type from '../models/type';

const routes = Router();

routes.get('/', (req, res) => {
  Type.find({}).then((data) => {
    res.send({ data });
  }).catch((e) => {
    res.status(500).send();
  })
});

export default routes;
