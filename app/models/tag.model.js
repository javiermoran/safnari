'use strict';

import mongoose from 'mongoose';

const TagSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 1,
    trim: true
  }
});

export default mongoose.model(TagSchema);
