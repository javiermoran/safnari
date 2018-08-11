import mongoose from 'mongoose';

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
  format: string,
  picture: string,
  created: {
    type: Number
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  coll: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  tags: [mongoose.Schema.Types.ObjectId]
});

ItemSchema.pre('save', function(next) {
  this.created = new Date().getTime();
  next();
});

export default mongoose.model('Item', ItemSchema);
