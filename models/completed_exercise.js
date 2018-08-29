const config = require('config');
const mongoose = require('mongoose');
const Workout = require('./workout');
const Exercise = require('./exercise');

const completedExerciseSchema = new mongoose.Schema({
  workout_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  exercise_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: {
    type: Number,
    min: 1,
    required: true
  },
  reps: {
    type: Number,
    min: 1,
    required: true
  },
  weight: {
    type: Number,
    min: 0,
    default: 0
  },
  mum: {
    type: Boolean,
    default: false
  }
});

const completedExercise = mongoose.model('completedExercise', completedExerciseSchema);
module.exports = completedExercise
