const config = require('config');
const mongoose = require('mongoose');
const User = require('./user');

const workoutSchema = new mongoose.Schema({
  user {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Workout = mongoose.model('Workout', workoutSchema);
exports.Workout = Workout;