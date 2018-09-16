'use strict';

import { Router } from 'express';
import _ from 'lodash';
import sharp from 'sharp'

import Item from '../models/item.model';
import auth from '../middleware/auth';
import validId from '../middleware/valid-id';

const routes = Router();

routes.post('/', auth, (req, res) => {
  const { title, number, publisher, artist, format, picture, type, coll, tags } = req.body;

  const body = { 
    title, 
    number, 
    publisher, 
    artist, 
    format, 
    picture, 
    type, 
    coll, 
    tags 
  };

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
    Item.find(query)
      .populate('type')
      .populate('coll')
      .then((items) => {
        const promises = [];
        items.forEach((item) => {
          const uri = item.picture.split(';base64,').pop()
          const buf = new Buffer(uri,'base64')
          promises.push(sharp(buf).resize(300).png().toBuffer())
        });

        Promise.all(promises)
          .then((images) => {
            const data = items.map((item, index) => {
              item.picture = 'data:image/png;base64,' + images[index].toString('base64');
              return item;
            });

            res.send({ total, data: items });
          })
          .catch((e) => {
            res.status(400).send(e);        
          })
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
  const fields = ['title', 'number', 'publisher', 'format', 'picture', 'type', 'coll', 'tags', 'artist'];
  const body = _.pick(req.body, fields);
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
