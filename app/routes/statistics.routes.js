'use strict';

import { Router } from 'express';
import auth from '../middleware/auth';
import Collection from '../models/collection.model';
import Item from '../models/item.model';

const routes = Router();

routes.get('/counts', auth, (req, res) => {
  const creator = req.user._id;
  const promises = [];

  promises.push(Collection.find({ creator }).countDocuments());
  promises.push(Item.find({ creator }).countDocuments());

  Promise.all(promises)
    .then((result) => {
      const [collections, items] = result;
      res.send({ collections, items });
    }).catch((e) => {
      res.status(500).send();
    });
});

routes.get('/collections/types', auth, (req, res) => {
  const creator = req.user._id;
  Collection.getDistinctTypes(req)
    .then((types) => {
      const promises = types.map((typeObj) => {
        const type = typeObj._id;
        return Collection.find({type, creator}).countDocuments();
      });

      Promise.all(promises)
        .then((result) => {
          const data = result.map((count, index) => {
            const { name, description, icon } = types[index];
            return { name, description, icon, count };
          });

          res.send(data);
        }).catch((e) => {
          res.status(500).send();
        })

    }).catch((e) => {
      res.status(500).send();
    })
});

routes.get('/collections/items', auth, (req, res) => {
  const creator = req.user._id;
  Collection
      .find({ creator })
      .populate('type')
      .then((collections) => {
        const promises = collections.map((collection) => {
          const coll = collection._id;
          return Item.find({ creator, coll }).countDocuments();
        });

        Promise.all(promises)
          .then((result) => {
            const total = result.reduce((a, b) => a + b);
            const data = result.map((count, index) => {
              const { name } = collections[index];
              const pct = Math.round((count / total) * 100);
              return { name, count, pct }; 
            });
          
            res.send({ total, data });
          }).catch((e) => {
            res.status(500).send();
          })
      });
});

routes.get('/items/types', auth, (req, res) => {
  const creator = req.user._id;
  Item.getDistinctTypes(req)
    .then((types) => {
      const promises = types.map((typeObj) => {
        const type = typeObj._id;
        return Item.find({type, creator}).countDocuments();
      });

      Promise.all(promises)
        .then((result) => {
          const data = result.map((count, index) => {
            const { name, description, icon } = types[index];
            return { name, description, icon, count };
          });

          const total = data.reduce((a, b) => ({count: a.count + b.count }));

          res.send({ total: total.count, data });
        }).catch((e) => {
          console.log(e);
          res.status(500).send();
        })

    }).catch((e) => {
      console.log(e);
      res.status(500).send();
    })
});

routes.get('/items/history', auth, (req, res) => {
  const creator = req.user._id;
  const today = new Date().getTime();
  
  let prev = new Date();
  prev.setDate(1);
  prev.setMonth(prev.getMonth() - 1);
  
  Item.find({ created: { $gte: prev }, creator: req.user._id })
    .then((result) => {
      const groups = result.reduce((groups, item) => {
        let date = new Date(item.created);
        date = date.setHours(0,0,0,0);

        if(!groups[date]) {
          groups[date] = [];
        }

        groups[date]++;
        
        return groups;
      }, {});

      const data = Object.keys(groups).map((date) => ({ count: groups[date], date }));

      res.status(200).send({ total: data.length, data });
    }).catch((e) => {
      res.status(500).send();
      console.log(e);
    });

});

export default routes;
