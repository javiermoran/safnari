import { Router } from 'express';
import Type from '../models/type';

const routes = Router();

routes.get('/', (req, res) => {
  Type.find({}).count().then((count) => {
    if(count === 0) {
      insertDefaults().then((docs) => {
        res.send({ docs });
      })
    } else {
      Type.find({}).then((data) => {
        res.send({ data });
      }).catch((e) => {
        res.status(500).send();
      })
    }
  }).catch((e) => {
    res.status(500).send();
  })
});

function insertDefaults() {
  const defaultTypes = [
    new Type({ name: 'book', description: 'Book', icon: 'fa-book' }),
    new Type({ name: 'cbook', description: 'Comic Book', icon: 'fa-book-open' }),
    new Type({ name: 'bgame', description: 'Board Game', icon: 'fa-chess-pawn' }),
    new Type({ name: 'toy', description: 'Toy', icon: 'fa-table-tennis' }),
    new Type({ name: 'vgame', description: 'Videogame', icon: 'fa-gamepad'}),
    new Type({ name: 'record', description: 'Record', icon: 'fa-compact-disc' })
  ];

  return Type.insertMany(defaultTypes);
}

export default routes;
