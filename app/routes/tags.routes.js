'use strict';

import { Router } from 'express';
import Tag from '../models/tag.model';
import auth from '../middleware/auth';
import validId from '../middleware/valid-id';

const routes = Router();

routes.post('/', auth, (req, res) => {
  const userId = req.user._id;
  const { name, color } = req.body;
  const body = { name, color, user: userId };

  const tag = new Tag(body);
  tag.save().then((tag) => {
    if(!tag) {
      return res.status(400).send();
    }

    res.status(201).send(tag);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

routes.get('/', auth, (req, res) => {
  const user = req.user._id;
  const query = { user };
  
  Tag.find(query).countDocuments().then(total => {
     Tag.find(query).then(tags => {
        res.status(200).send({ total, data: tags });
     }).catch((e) => {
      res.status(400).send(e);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

routes.patch('/:id', [auth, validId], (req, res) => {
  const id = req.params.id;
  const { name, color } = req.body;
  const body = { name, color };

  Tag.findOneAndUpdate({ _id: id }, body, { new: true })
  .then((item) => {
    if(!item) {
      return res.status(404).send();
    }

    res.send(item);
  })
  .catch((e) => {
    res.status(400).send();
  });
});

export default routes;
