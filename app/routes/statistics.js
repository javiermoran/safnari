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
  Collection.getDistinctTypes(req)
    .then((types) => {
      const promises = types.map((typeObj) => {
        const type = typeObj._id;
        return Collection.find({type}).countDocuments();
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

export default routes;
