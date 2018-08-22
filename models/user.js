const config = require('config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    maxlength: 255,
    required: true,
    unique: true
  },
  password_digest: {
    type: String,
    minlength: 6,
    maxlength: 255,
    required: true
  },
  remember_digest: {
    type: String
  },
  admin: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.generateAuthToken = function() {};

const User = mongoose.model('User', userSchema);
module.exports = User;