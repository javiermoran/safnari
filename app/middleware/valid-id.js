'use strict';

import { ObjectID } from 'mongodb';

const validId = (req, res, next) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  next();
}

export default validId;
