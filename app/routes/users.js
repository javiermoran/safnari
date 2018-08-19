import { Router } from 'express';
import User from '../models/user.model';
import auth from '../middleware/auth';

const routes = Router();

// POST /users
routes.post('/', (req, res) => {
  const {username, email, password, picture} = req.body;
  const body = {username, email, password, picture};

  const user = new User(body);
  user.save().then((user) => {
    !user ? res.status(400).send() : res.status(201).send(user);
  }).catch((e) => {
    res.status(400).send({ error: e });
  });
});

// POST /users/token
routes.post('/token', (req, res) => {
  const { email, password, username } = req.body;

  if(email && username) {
    return res.status(400).send({
      error: { message: 'Only username or email should be provided' }
    });
  }

  if(!password) {
    res.status(400).send({
      error: { message: 'Password expected' } 
    });
  }

  const searchParam = !email ? { username } : { email };
  User.findOne(searchParam).then((user) => {
    if(!user) { return Promise.reject(); }

    user.validatePassword(password).then((result) => {
      user.generateToken().then((token) => {
        res.send({ token });
      });
    }).catch((e) => { 
      res.status(404).send(e);
    });

  }).catch((e) => {
    res.status(404).send(e);
  });
});

// DELETE /users/token
routes.delete('/token', auth, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch((e) => {
    res.status(400).send(e);
  })
});

// GET /users/me
routes.get('/me', auth, (req, res) => {
  res.send(req.user);
});

export default routes;
