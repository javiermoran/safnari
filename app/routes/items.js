import { Router } from 'express';
import Item from '../models/item';
import auth from '../middleware/auth';
import validId from '../middleware/valid-id';
import _ from 'lodash';

const routes = Router();

routes.post('/', auth, (req, res) => {
  const { title, number, publisher, format, picture, type, coll, tags } = req.body;
  const body = { title, number, publisher, format, picture, type, coll, tags };

  body.creator = req.user._id;

  const item = new Item(body);

  item.save().then((item) => {
    if(!item) {
      return res.status(400).send();
    }

    res.status(201).send(item);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

routes.get('/', auth, (req, res) => {
  const creator = req.user._id;
  const coll = req.query.collection;
  const query = {creator, coll};

  if(!coll) {
    delete query.coll;
  }

  Item.find(query).countDocuments().then((total) => {
    Item.find(query).then((data) => {
      res.send({ total, data });
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

routes.get('/:id', [auth, validId], (req, res) => {
  const _id = req.params.id;
  const creator = req.user._id;

  Item.findOne({ _id, creator })
    .then((item) => {
      res.send(item);
    }).catch((e) => {
      res.status(500).send(e);
    });
});

routes.patch('/:id', [auth, validId], (req, res) => {
  const body = _.pick(req.body, ['title', 'number', 'publisher', 'format', 'picture', 'type', 'coll', 'tags']);
  const id = req.params.id;

  Item.findByIdAndUpdate(id, { $set: body }, { new: true })
  .then((item) => {
    if(!item) {
      return res.status(404).send();
    }

    res.send(item);
  })
  .catch((e) => {
    res.status(400).send()
  });
});

routes.delete('/:id', [auth, validId], (req, res) => {
  const id = req.params.id;

  Item.findByIdAndRemove(id).then((item) => {
    if(!item) {
      res.status(404).send();
    }

    res.send(item);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

export default routes;
