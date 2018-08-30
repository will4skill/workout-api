const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/objectId_validation');

router.get('/', [auth, admin], async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});

router.post('/', async (req, res) => {
  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const password_digest = await bcrypt.hash(password, salt);
  
  let user = new User({ 
    name: req.body.name, 
    email: req.body.email, 
    password_digest: password_digest
  });
  const found_user = await User.findOne({ email: req.body.email });

  if (found_user) return res.status(400).send('Email exists already');
  
  try { 
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({
      id: user._id,
      name: req.body.name,
      email: req.body.email
    });
  } catch (err) {
    res.status(400).send(err);
  } 
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password_digest -remember_digest');
  res.send(user);
});

router.put('/me', auth, async (req, res) => {
  // To do: 
  // 1. add ability to update password. Don't forget to update token if password is updated.
  // 2. add ability to update a single property

  try {
      const user = await User.findByIdAndUpdate(req.user._id , 
      { 
        name: req.body.name,
        email: req.body.email
      }, 
      { new: true, runValidators: true });
      res.send(user);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) {
    res.status(404).send('User ID not found');
  } else {
    res.send(user);
  }
});

module.exports = router;