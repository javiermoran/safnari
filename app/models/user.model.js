'use strict';

import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Settings from './settings.model';

dotenv.config();

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true
  },
  picture: {
    type: String,
    required: false,
    trim: true,
    minlength: 1
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  settings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Settings'
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function() {
  const { email, username, picture } = this.toObject();
  const { darkMode } = this.toObject().settings;
  return { email, username, picture, settings: { darkMode } };
};

UserSchema.methods.generateToken = function() {
  const access = 'auth';
  const _id = this._id.toHexString();
  const expirationTime = process.env.EXPIRATION_TIME || 259200000;
  const expiration = new Date().getTime() + expirationTime;
  const token = jwt.sign({_id, access, expiration}, process.env.SECRET);

  this.tokens.push({access, token});

  return this.save().then(() => token);
};

UserSchema.methods.validatePassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, res) => {
      res ? resolve(res) : reject();
    });
  });
}

UserSchema.methods.removeToken = function(token) {
  return this.update({
    $pull: {
      tokens: { token }
    }
  });
};

UserSchema.statics.findByToken = function(token) {
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.SECRET);
  } catch(e) {
    return Promise.reject();
  }

  return this.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

const createSettings = (model) => {
  return new Promise((resolve) => {
    if (!model.settings) {
      const settings  = new Settings();
      settings.save().then((settings) => {
        resolve(settings);
      }).catch((e) => console.log(e))
    } else {
      resolve(null);
    }
  });
}

UserSchema.pre('save', function (next) {
  createSettings(this).then((settings) => {
    if (settings) {
      this.settings = settings;
    }

    //Encrypts the password before saving it
    if (this.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
          this.password = hash;
          next();
        });
      });
    } else {
      next();
    }
  });
});

export default mongoose.model('User', UserSchema);
