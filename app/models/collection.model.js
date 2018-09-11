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
  next();
});

export default mongoose.model('Collection', collectionSchema);
