const express = require('express');
const router = express.Router();
const request = require('supertest');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/objectId_validation');
const Muscle = require('../models/muscle');

router.get('/', auth, async (req, res) => { 
  const muscles = await Muscle.find().sort('name');
  res.send(muscles);
});

router.post('/', [auth, admin], async (req, res) => { 
  const muscle = new Muscle({ name: req.body.name });
  
  try { 
    await muscle.save();
    res.send(muscle);
  } catch (err) {
    res.status(400).send(err);
  } 
});

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => { 
  const muscle = await Muscle.findById(req.params.id);
  if (!muscle) {
    res.status(404).send('Muscle with submitted ID not found');
  } else {
    res.send(muscle);
  }
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => { 
  let muscle = await Muscle.findById(req.params.id);
  if (!muscle) return res.status(404).send('Muscle with submitted ID not found');

  try {
      muscle = await Muscle.findByIdAndUpdate(req.params.id , 
      { name: req.body.name }, { new: true, runValidators: true });
      res.send(muscle);
  } catch(err) {
    res.status(400).send(err);
  }

});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => { 
  const muscle = await Muscle.findByIdAndRemove(req.params.id);
  if (!muscle) {
    res.status(404).send('Muscle with submitted ID not found');
  } else {
    res.send(muscle);
  }
});

module.exports = router;