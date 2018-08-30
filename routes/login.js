const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');


router.post('/', async (req, res) => { 
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const found_password = await bcrypt.compare(req.body.password, user.password_digest);
  if (!found_password) return res.status(400).send('Invalid email or password.');

  const jwt = user.generateAuthToken();
  res.send({ jwt });
});

module.exports = router;