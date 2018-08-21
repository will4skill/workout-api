const express = require('express');
const app = express();
const winston = require('winston');
const config = require('config');
require('express-async-errors'); // replaces try-catch blocks in route handlers
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi); // Add ObjectID validation to joi

// ** Node Error Logging: Start ************************************************
winston.handleExceptions(
  new winston.transports.Console({ colorize: true, prettyPrint: true }),
  new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);
process.on('unhandledRejection', (exception) => { throw exception });
winston.add(winston.transports.File, { filename: 'logfile.log' });
// ** Node Error Logging: End **************************************************

// ** Express Routes: Start ****************************************************
const users = require('./routes/users');
const workouts = require('./route/workouts');
const completed_exercises = require('./route/completed_exercises');
const exercises = require('./route/exercises');
const muscles = require('./route/muscles');
const login = require('./route/login');
const logout = require('./route/logout');
const error = require('./middleware/error');

app.use(express.json());
app.use('/api/users', users);
app.use('/api/workouts', workouts);
app.use('/api/completed_exercises', completed_exercises);
app.use('/api/exercises', exercises);
app.use('/api/muscles', muscles);
app.use('/api/login', login);
app.use('/api/logout', logout);
app.use(error);
// ** Express Routes: End ******************************************************

// ** Database Setup: Start ****************************************************
const db = config.get('db');
mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
// ** Database Setup: End ******************************************************

// ** Private Key Setup: Start *************************************************
if (config.has('jwt_private_key') == false) {
  throw new Error('FATAL ERROR: jwt_private_key is not defined.');
}
// ** Private Key Setup: End ***************************************************

// ** Server Setup: Start ******************************************************
const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
module.exports = server; // Export for use in tests
// ** Server Setup: End ********************************************************
