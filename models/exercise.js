const config = require('config');
const mongoose = require('mongoose');
const Muscle = require('./muscle');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true
  },
  muscle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Muscle',
    required: true
  }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;