'use strict';

import mongoose from 'mongoose';

const TagSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 1,
    trim: true
  },
  color: {
    type: String,
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

export default mongoose.model('Tag', TagSchema);
