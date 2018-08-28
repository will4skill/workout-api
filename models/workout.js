const config = require('config');
const mongoose = require('mongoose');
const User = require('./user');

const workoutSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    default: Date.now,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
