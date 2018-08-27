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

router.get('/', auth, async (req, res) => { 
  let completed_exercises = await CompletedExercise.find().sort('name')
    .populate('exercise_id', 'name -_id')
    .populate({ path: 'workout_id', select: '-_id'
    });

  // Return all completed exercises for current user (multiple workouts possible)
  // ** To do: filter with CompletedExercise.find() instead. **
  completed_exercises = completed_exercises.filter(item => item.workout_id.user_id == req.user._id);

  res.send(completed_exercises);
});

router.get('/:id', [auth, validateObjectId], async (req, res) => { 
  const completed_exercise = await CompletedExercise.findById(req.params.id)
    .populate('exercise_id', 'name -_id');
  if (!completed_exercise) {
    res.status(404).send('Completed exercise with submitted ID not found');
  } else {
    res.send(completed_exercise);
  }
});

router.put('/:id', [auth, validateObjectId], async (req, res) => { 
  let completed_exercise = await CompletedExercise.findById(req.params.id);
  if (!completed_exercise) return res.status(404).send('Completed exercise with submitted ID not found');

  if (!mongoose.Types.ObjectId.isValid(req.body.exercise_id)) {
    return res.status(400).send('Invalid Exercise ID');
  }
  const exercise = await Exercise.findById(req.body.exercise_id);
  if (!exercise) return res.status(400).send('Invalid Exercise');

  const workout_id = completed_exercise.workout_id;

  try {
      completed_exercise = await CompletedExercise.findByIdAndUpdate(req.params.id , 
      { 
        exercise_id: req.body.exercise_id,
        sets: req.body.sets,
        reps: req.body.reps, 
        workout_id: workout_id 
      }, 
      { new: true, runValidators: true });
      res.send(completed_exercise);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => { 
  const completed_exercise = await CompletedExercise.findByIdAndRemove(req.params.id)
    .populate('exercise_id', 'name -_id');
  if (!completed_exercise) {
    res.status(404).send('Completed exercise with submitted ID not found');
  } else {
    res.send(completed_exercise);
  }
});


module.exports = router;