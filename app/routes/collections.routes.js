import { Router } from 'express';
import { ObjectID } from 'mongodb';

import auth from '../middleware/auth';
import validId from '../middleware/valid-id';
import Collection from '../models/collection.model';

const routes = Router();

routes.post('/', auth, (req, res) => {
  const { name, type, parent } = req.body;
  const creator = req.user._id;

  const collection = new Collection({ name, type, creator, parent });
  collection.save().then((collection) => {
    if (!collection) {
      return res.status(400).send(e);
    }

    res.status(201).send(collection);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

routes.get('/', auth, (req, res) => {
  const creator = req.user._id;

  const query = { creator };

  if(req.query.parent) {
    query['parent'] = req.query.parent;
  }

  Collection.find(query).countDocuments().then((total) => {
    Collection
      .find(query)
      .populate('type')
      .populate('parent')
      .then((data) => {
        setTimeout(() => {
          res.send({ total, data });
        }, 1000);
      });
  }).catch((e) => {
    res.status(500).send();
  });
});

routes.get('/:id', [auth, validId], (req, res) => {
  const _id = req.params.id;
  const creator = req.user._id;

  Collection
    .findOne({ _id, creator })
    .populate('type')
    .populate('parent')
    .then((collection) => {
      res.send(collection);
    }).catch((e) => {
      res.status(500).send(e);
    });
});

routes.patch('/:id', [auth, validId], (req, res) => {
  const { name } = req.body;
  const id = req.params.id;

  Collection.findByIdAndUpdate(id, { $set: { name } }, { new: true })
  .then((collection) => {
    if(!collection) {
      return res.status(404).send();
    }

    res.send(collection);
  })
  .catch((e) => {
    res.status(400).send()
  });
});

export default routes;
