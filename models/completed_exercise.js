const config = require('config');
const mongoose = require('mongoose');
const Workout = require('./workout');
const Exercise = require('./exercise');

const completedExerciseSchema = new mongoose.Schema({
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: {
    type: Number,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  mum: {
    type: Boolean,
    default: false
  }
});

const completedExercise = mongoose.model('completedExercise', completedExerciseSchema);
exports.completedExercise = completedExercise
