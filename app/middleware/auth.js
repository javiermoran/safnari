'use strict';

import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const auth = (req, res, next) => {
  let token = req.header('Authorization') || req.header('x-auth');

  if(!token) {
    return res.status(401).send();
  }

  if(token.indexOf('Bearer') !== -1) {
    const tokenArr = token.split(' ');
    token = tokenArr[1];
  }

  User.findByToken(token).then((user) => {
    if(!user) {
      return res.status(401).send();
    }

    req.user = user;
    req.token = token;

    const decoded = jwt.verify(token, process.env.SECRET);
    if(decoded.expiration < new Date().getTime()) {
      user.removeToken(token).then(() => {
        res.status(401).send();    
      });
    } else {
      next(); 
    }
  }).catch((e) => {
    res.status(401).send();
  })
}

export default auth;
