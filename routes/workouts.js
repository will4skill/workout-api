const express = require('express');
const router = express.Router();
const request = require('supertest');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/objectId_validation');
const CompletedExercise = require('../models/completed_exercise');
const Exercise = require('../models/exercise');
const Muscle = require('../models/muscle');
const Workout = require('../models/workout');
const User = require('../models/user');

router.get('/:id', auth, async (req, res) => { 
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid Workout ID');
  }

  const workout = await Workout.findById(req.params.id);
  if (!workout) return res.status(400).send('Invalid Workout ID');

  let completed_exercises = await CompletedExercise
    .find() // Problem: can't get .find({ workouts: workout.id }) to work   
    .populate('exercise_id', 'name -_id') // Insert names from Exercise documents
    .sort('name');
  
  // Work around for above problem: 
  // Return all completed exercises for current user and current workout (multiple workouts not possible)
  // ** To do: filter with CompletedExercise.find() instead. **
  completed_exercises = completed_exercises.filter(item => item.workout_id == workout.id);

  res.send(completed_exercises);
});

module.exports = router;