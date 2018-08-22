const config = require('config');
const mongoose = require('mongoose');
const Muscle = require('./muscle');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true
  },
  muscle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Muscle'
  }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
exports.Exercise = Exercise;