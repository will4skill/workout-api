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
  const completed_exercise = await CompletedExercise.findById(req.params.id)
    .populate('exercise_id', 'name -_id')
    .populate('workout_id', '-__v');

  if (!completed_exercise) {
    res.status(404).send('Completed exercise with submitted ID not found');
  } else { // Check for current user
    if (req.user._id !== (completed_exercise.workout_id.user_id).toString()) {
      res.status(403).send('Forbidden');
    } else {
      res.send(completed_exercise);
    }
  }
});

router.put('/:id', [auth, validateObjectId], async (req, res) => { 
  let completed_exercise = await CompletedExercise.findById(req.params.id)
      .populate('workout_id', '-__v');
  if (!completed_exercise) {
    return res.status(404).send('Completed exercise with submitted ID not found');
  } else { // Check for current user
    if (req.user._id !== (completed_exercise.workout_id.user_id).toString()) {
      return res.status(403).send('Forbidden');
    }
  }

  if (!mongoose.Types.ObjectId.isValid(req.body.exercise_id)) {
    return res.status(400).send('Invalid Exercise ID');
  }
  const exercise = await Exercise.findById(req.body.exercise_id);
  if (!exercise) return res.status(400).send('Invalid Exercise');

  try {
      completed_exercise = await CompletedExercise.findByIdAndUpdate(req.params.id , 
      { 
        exercise_id: req.body.exercise_id,
        workout_id: completed_exercise.workout_id,
        machine: req.body.machine || completed_exercise.machine,
        sets: req.body.sets,
        reps: req.body.reps, 
        load: req.body.load || completed_exercise.load,
        mum: req.body.mum || completed_exercise.mum
      }, 
      { new: true, runValidators: true });
      res.send(completed_exercise);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => { 
  let completed_exercise = await CompletedExercise.findById(req.params.id)
    .populate('exercise_id', 'name -_id')
    .populate('workout_id', '-__v');
  
  if (!completed_exercise) {
    res.status(404).send('Completed exercise with submitted ID not found');
  } else { // Check for current user
    if (req.user._id !== (completed_exercise.workout_id.user_id).toString()) {
      res.status(403).send('Forbidden');
    } else {
      completed_exercise = await CompletedExercise.findByIdAndRemove(req.params.id)
        .populate('exercise_id', 'name -_id');
      res.send(completed_exercise);
    }
  }
});

module.exports = router;