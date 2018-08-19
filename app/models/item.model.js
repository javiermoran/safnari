import mongoose from 'mongoose';
import Type from './type.model';

const requiredString = {
  type: String,
  required: true,
  minlenght: 1,
  trim: true
}

const string = {
  type: String,
  required: false,
  minlenght: 1,
  trim: true
}

const ItemSchema = mongoose.Schema({
  title: requiredString,
  number: {
    type: Number,
    required: false
  },
  publisher: string,
  artist: string,
  format: string,
  picture: string,
  created: {
    type: Number
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Type'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  coll: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Collection'
  },
  tags: [mongoose.Schema.Types.ObjectId]
});

ItemSchema.pre('save', function(next) {
  this.created = new Date().getTime();
  next();
});

ItemSchema.statics.getDistinctTypes = function(req) {
  const creator = req.user._id;
  return this.find({ creator })
    .distinct('type')
    .then(types => Promise.all(types.map(type => Type.findById(type))))
    .catch(e => Promise.reject(e));
}

export default mongoose.model('Item', ItemSchema);
