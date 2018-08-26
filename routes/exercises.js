const express = require('express');
const router = express.Router();
const request = require('supertest');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/objectId_validation');
const Muscle = require('../models/muscle');
const Exercise = require('../models/exercise');


router.get('/', auth, async (req, res) => { 
  const exercises = await Exercise.find().sort('name');
  res.send(exercises);
});

router.post('/', [auth, admin], async (req, res) => { 
  if (!mongoose.Types.ObjectId.isValid(req.body.muscle)) {
    return res.status(400).send('Invalid Muscle ID');
  }

  const muscle = await Muscle.findById(req.body.muscle);
  if (!muscle) return res.status(400).send('Invalid Muscle');

  const exercise = new Exercise({ 
    name: req.body.name, 
    muscle: req.body.muscle 
  });
  
  try { 
    await exercise.save();
    res.send(exercise);
  } catch (err) {
    res.status(400).send(err);
  } 
});

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => { 
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) {
    res.status(404).send('Exercise with submitted ID not found');
  } else {
    res.send(exercise);
  }
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => { 
  let exercise = await Exercise.findById(req.params.id);
  if (!exercise) return res.status(404).send('Exercise with submitted ID not found');

  if (!mongoose.Types.ObjectId.isValid(req.body.muscle)) {
    return res.status(400).send('Invalid Muscle ID');
  }

  const muscle = await Muscle.findById(req.body.muscle);
  if (!muscle) return res.status(400).send('Invalid Muscle');

  try {
      exercise = await Exercise.findByIdAndUpdate(req.params.id , 
      { name: req.body.name, muscle: req.body.muscle }, 
      { new: true, runValidators: true });
      res.send(exercise);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => { 
  const exercise = await Exercise.findByIdAndRemove(req.params.id);
  if (!exercise) {
    res.status(404).send('Exercise with submitted ID not found');
  } else {
    res.send(exercise);
  }
});

module.exports = router;