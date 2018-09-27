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
  const workouts = await Workout.find({user_id: req.user._id}).lean();

  for (let workout of workouts) {
    workout.exercises = await CompletedExercise.find({workout_id: workout._id})
      .populate('exercise_id', 'name -_id');
  }
  res.send(workouts);
});

router.post('/', auth, async (req, res) => { 
  let workout = new Workout({ date: req.body.date, user_id: req.user._id });
  
  try { 
    workout = await workout.save();
    res.send(workout);
  } catch (err) {
    res.status(400).send(err);
  } 
});

router.get('/:id', [auth, validateObjectId], async (req, res) => { 
  const workout = await Workout.findById(req.params.id);
  if (!workout) {
    return res.status(404).send('Workout with submitted ID not found');
  } else { // Check for current user
    if (req.user._id !== (workout.user_id).toString()) {
      return res.status(403).send('Forbidden');
    }
  }

  let completed_exercises = await CompletedExercise
    .find({ workout_id: workout._id })  
    .populate('exercise_id', 'name -_id'); // Insert names from Exercise documents

  res.send(completed_exercises);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => { 
  let workout = await Workout.findById(req.params.id);
  if (!workout) {
    return res.status(404).send('Workout with submitted ID not found');
  } else { // Check for current user
    if (req.user._id !== (workout.user_id).toString()) {
      return res.status(403).send('Forbidden');
    }
  }

  try {
      workout = await Workout.findByIdAndUpdate(req.params.id, 
      { date: req.body.date, user_id: req.user._id }, 
      { new: true, runValidators: true });
      res.send(workout);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => { 
  let workout = await Workout.findById(req.params.id);
  if (!workout) {
    return res.status(404).send('Workout with submitted ID not found');
  } else { // Check for current user
    if (req.user._id !== (workout.user_id).toString()) {
      return res.status(403).send('Forbidden');
    } else {
      // Delete associated completed_workouts
      workout = await Workout.findByIdAndRemove(req.params.id);
      await CompletedExercise.deleteMany({ workout_id: workout._id }); 
      res.send(workout); // Potential update: return removed completed_workouts
    } 
  }
});

router.post('/:id/completed_exercises/', auth, async (req, res) => { 
  const workout = await Workout.findById(req.params.id);
  if (!workout) {
    return res.status(404).send('Workout with submitted ID not found');
  } else { // Check for current user
    if (req.user._id !== (workout.user_id).toString()) {
      return res.status(403).send('Forbidden');
    }
  }

  if (!mongoose.Types.ObjectId.isValid(req.body.exercise_id)) {
    return res.status(400).send('Invalid Exercise ID');
  }
  const exercise = await Exercise.findById(req.body.exercise_id);
  if (!exercise) return res.status(400).send('Invalid Exercise');
  
  let completed_exercise = new CompletedExercise({ 
    exercise_id: req.body.exercise_id,
    workout_id: req.params.id,
    exercise_type: req.body.exercise_type,
    unilateral: req.body.unilateral || false,
    sets: req.body.sets,
    reps: req.body.reps, 
    load: req.body.load || 0,
    mum: req.body.mum || false
  });

  try { 
    completed_exercise = await completed_exercise.save();
    res.send(completed_exercise);
  } catch (err) {
    res.status(400).send(err);
  } 
});

module.exports = router;