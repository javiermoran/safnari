import mongoose from 'mongoose';

const TypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String
  }
});

export default mongoose.model('Type', TypeSchema);
