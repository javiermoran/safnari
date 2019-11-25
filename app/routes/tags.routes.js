'use strict';

import { Router } from 'express';
import mongoose from 'mongoose';
import Tag from '../models/tag.model';
import Item from '../models/item.model';
import auth from '../middleware/auth';
import validId from '../middleware/valid-id';

const routes = Router();

function colorGenerator() {
  //blue to magenta
  const ranges = [[150, 350]];

  //get max random
  let total = 0;
  for (let i = 0; i < ranges.length; i += 1) {
    total += ranges[i][1] - ranges[i][0] + 1;
  }

  //get random hue index
  var randomHue = Math.floor(Math.random() * total);

  //convert index to actual hue
  var pos = 0;
  for (let i = 0; i < ranges.length; i += 1) {
    pos = ranges[i][0];
    if (randomHue + pos <= ranges[i][1]) {
      randomHue += pos;
      break;
    } else {
      randomHue -= ranges[i][1] - ranges[i][0] + 1;
    }
  }
  return "hsl(" + randomHue + ",44%,60%)";
}

routes.post('/', auth, (req, res) => {
  const userId = req.user._id;
  const { name } = req.body;
  const color = colorGenerator();
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
    if (!item) {
      return res.status(404).send();
    }

    res.send(item);
  })
  .catch((e) => {
    res.status(400).send();
  });
});

routes.get('/:id/items', auth, (req, res) => {
  const id = req.params.id;
  const user = req.user._id;
  const query = { creator: user };

  Tag.findById(id).then(tag => {
    if (!tag) {
      return res.status(404).send();
    }

    query.tags = [mongoose.Types.ObjectId(tag._id)];

    Item.find(query).countDocuments().then(total => {
      Item
        .find(query)
        .populate('coll')
        .populate('type')
        .then(data => {
          res.status(200).send({ total, data });
        });
    }).catch((e) => {
      res.status(400).send(e);
    });
    
  }).catch((e) => {
    res.status(400).send(e);
  });
});

export default routes;
