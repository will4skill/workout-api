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

router.get('/:id', [auth, validateObjectId], async (req, res) => { 
  const workout = await Workout.findById(req.params.id);
  if (!workout) return res.status(404).send('Invalid Workout ID');

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

router.put('/:id', [auth, validateObjectId], async (req, res) => { 
  let workout = await Workout.findById(req.params.id);
  if (!workout) return res.status(404).send('Workout with submitted ID not found');

  // if (!mongoose.Types.ObjectId.isValid(req.body.muscle_id)) {
  //   return res.status(400).send('Invalid Muscle ID');
  // }

  // const muscle = await Muscle.findById(req.body.muscle_id);
  // if (!muscle) return res.status(400).send('Invalid Muscle');

  // try {
  //     exercise = await Exercise.findByIdAndUpdate(req.params.id , 
  //     { name: req.body.name, muscle_id: req.body.muscle_id }, 
  //     { new: true, runValidators: true });
  //     res.send(exercise);
  // } catch(err) {
  //   res.status(400).send(err);
  // }
});


router.delete('/:id', [auth, validateObjectId], async (req, res) => { 
  const workout = await Workout.findByIdAndRemove(req.params.id);
  if (!workout) {
    res.status(404).send('Workout with submitted ID not found');
  } else {
    // To do: delete all associated CompletedExercises
    res.send(exercise);
  }
});


module.exports = router;