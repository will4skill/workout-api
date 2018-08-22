const config = require('config');
const mongoose = require('mongoose');

const muscleSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true
  }
});

const Muscle = mongoose.model('Muscle', muscleSchema);
exports.Muscle = Muscle;