import mongoose from 'mongoose';

const collectionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlenght: 1
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  created: {
    type: Number
  }
});

collectionSchema.pre('save', function(next) {
  this.created = new Date().getTime();
  next();
});

export default mongoose.model('Collection', collectionSchema);
