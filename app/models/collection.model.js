'use strict';

import mongoose from 'mongoose';
import Type from './type.model';

const collectionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlenght: 1,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Type'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Collection'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  breadcrumbs: [
    mongoose.Schema.Types.ObjectId
  ],
  created: {
    type: Number
  }
});

collectionSchema.statics.getDistinctTypes = function(req) {
  const creator = req.user._id;
  return this.find({ creator })
    .distinct('type')
    .then(types => Promise.all(types.map(type => Type.findById(type))))
    .catch(e => Promise.reject(e));
}

collectionSchema.pre('save', function (next) {
  this.created = new Date().getTime();
  this.breadcrumbs = [];
  if (this.parent) {
    this.constructor.findById(this.parent)
      .then((parentCollection) => {
        this.breadcrumbs = parentCollection.breadcrumbs;
        this.breadcrumbs.push(this.parent);
      })
      .finally(next);
  } else {
    next();
  }
});

export default mongoose.model('Collection', collectionSchema);
