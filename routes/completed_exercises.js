const express = require('express');
const router = express.Router();
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
  const completed_exercise = await CompletedExercise.findById(req.params.id);

  if (!completed_exercise) {
    res.status(404).send('Completed exercise with submitted ID not found');
  } else { // Check for current user
    const workout = await Workout.findById(completed_exercise.workout_id);
    if (req.user._id !== (workout.user_id).toString()) {
      res.status(403).send('Forbidden');
    } else {
      res.send(completed_exercise);
    }
  }
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  let completed_exercise = await CompletedExercise.findById(req.params.id);

  if (!completed_exercise) {
    return res.status(404).send('Completed exercise with submitted ID not found');
  } else { // Check for current user
    const workout = await Workout.findById(completed_exercise.workout_id);
    if (req.user._id !== (workout.user_id).toString()) {
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
        exercise_type: req.body.exercise_type,
        unilateral: req.body.unilateral === undefined ? false : req.body.unilateral, // because defaults not triggered by findByIdAndUpdate
        sets: req.body.sets,
        reps: req.body.reps,
        load: req.body.load || completed_exercise.load, // because defaults not triggered by findByIdAndUpdate
        mum: req.body.mum === undefined ? false : req.body.mum // because defaults not triggered by findByIdAndUpdate
      },
      { new: true, runValidators: true });
      res.send(completed_exercise);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  let completed_exercise = await CompletedExercise.findById(req.params.id);

  if (!completed_exercise) {
    res.status(404).send('Completed exercise with submitted ID not found');
  } else { // Check for current user
    const workout = await Workout.findById(completed_exercise.workout_id);
    if (req.user._id !== (workout.user_id).toString()) {
      res.status(403).send('Forbidden');
    } else {
      completed_exercise = await CompletedExercise.findByIdAndRemove(req.params.id)
      res.send(completed_exercise);
    }
  }
});

module.exports = router;
