'use strict';

import mongoose from 'mongoose';

const SettingsSchema = mongoose.Schema({
  darkMode: {
    type: Boolean,
    required: true,
    default: false
  }
});

export default mongoose.model('Settings', SettingsSchema);
