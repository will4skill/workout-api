const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => { 
  // let workout = new Workout({ date: req.body.date, user_id: req.user._id });
  
  // try { 
  //   workout = await workout.save();
  //   res.send(workout);
  // } catch (err) {
  //   res.status(400).send(err);
  // } 
});

module.exports = router;