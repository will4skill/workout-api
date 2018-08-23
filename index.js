const express = require('express');
const app = express();
const winston = require('winston');
const config = require('config');
require('express-async-errors'); // replaces try-catch blocks in route handlers
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi); // Add ObjectID validation to joi

// ** Node Error Logging: Start ************************************************
const logger = winston.createLogger({
  transports: [ new winston.transports.File({ filename: 'logfile.log' }) ],
  exceptionHandlers: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'exceptions.log' })
  ]
});
process.on('unhandledRejection', (exception) => { throw exception });
// ** Node Error Logging: End **************************************************

// ** Express Routes: Start ****************************************************
const users = require('./routes/users');
const workouts = require('./routes/workouts');
const completed_exercises = require('./routes/completed_exercises');
const exercises = require('./routes/exercises');
const muscles = require('./routes/muscles');
const login = require('./routes/login');
const logout = require('./routes/logout');
const error = require('./middleware/error');

app.use(express.json());
app.use('/api/users', users);
// app.use('/api/workouts', workouts);
// app.use('/api/completed_exercises', completed_exercises);
// app.use('/api/exercises', exercises);
// app.use('/api/muscles', muscles);
// app.use('/api/login', login);
// app.use('/api/logout', logout);
// app.use(error); // express default error handler
// ** Express Routes: End ******************************************************

// ** Database Setup: Start ****************************************************
const db = config.get('db');
mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`));
// ** Database Setup: End ******************************************************

// ** Private Key Setup: Start *************************************************
if (config.has('jwt_private_key') == false) {
  throw new Error('FATAL ERROR: jwt_private_key is not defined.');
}
// ** Private Key Setup: End ***************************************************

// ** Server Setup: Start ******************************************************
const port = 5000; //process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));
module.exports = server; // Export for use in tests
// ** Server Setup: End ********************************************************
