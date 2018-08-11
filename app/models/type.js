import mongoose from 'mongoose';

const TypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

export default mongoose.model('Type', TypeSchema);
