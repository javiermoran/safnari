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

          res.send(data);
        }).catch((e) => {
          console.log(e);
          res.status(500).send();
        })

    }).catch((e) => {
      console.log(e);
      res.status(500).send();
    })
});

export default routes;
