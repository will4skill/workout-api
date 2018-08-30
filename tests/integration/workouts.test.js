const CompletedExercise = require('../../models/completed_exercise');
const Exercise = require('../../models/exercise');
const Muscle = require('../../models/muscle');
const Workout = require('../../models/workout');
const User = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/workouts', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => {
    await Muscle.deleteMany({});
    await Exercise.deleteMany({});
    await CompletedExercise.deleteMany({});
    await server.close();
  });

  describe('GET /', () => {
    let user, other_user, token, muscle, exercise_1, exercise_2, 
    workout_1, workout_2, other_workout, completed_exercises;

    const response = async (jwt) => {
      return await request(server)
        .get('/api/workouts')
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123456" });
      await user.save();
      token = user.generateAuthToken();
      other_user = new User({ name: "binky", email: "bad@bunny.com", password_digest: "123456" });
      await other_user.save();
      muscle = new Muscle({ name: 'chest' });
      exercise_1 = new Exercise({ name: 'chest fly' , muscle_id: muscle._id });
      exercise_2 = new Exercise({ name: 'bench press' , muscle_id: muscle._id });
      await exercise_1.save();
      await exercise_2.save();
      workout_1 = new Workout({ user_id: user._id });
      workout_2 = new Workout({ user_id: user._id });
      other_workout = new Workout({ user_id: other_user._id });
      await workout_1.save();
      await workout_2.save();
      await other_workout.save();
      completed_exercises = [
          { exercise_id: exercise_1._id, sets: 4, reps: 8, workout_id: workout_1._id }, 
          { exercise_id: exercise_2._id, sets: 4, reps: 12, workout_id: workout_2._id },
          { exercise_id: exercise_2._id, sets: 4, reps: 12, workout_id: workout_2._id },
          { exercise_id: exercise_2._id, sets: 100, reps: 100, workout_id: other_workout._id }         
        ];
      await CompletedExercise.collection.insertMany(completed_exercises);
    });
    afterEach(async () => {
      await CompletedExercise.deleteMany({});
      await Exercise.deleteMany({});
      await Workout.deleteMany({});
      await User.deleteMany({});
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(token);

      expect(res.status).toBe(401);
    });

    it('should return all workouts for current user only (stat code 200)', async () => {
      const res = await response(token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some(w => w.exercise_id.name === 'chest fly')).toBeTruthy();
      expect(res.body.some(w => w.exercise_id.name === 'bench press')).toBeTruthy();
      expect(res.body.some(w => w.sets === 4)).toBeTruthy();
      expect(res.body.some(w => w.reps === 8)).toBeTruthy();
      expect(res.body.some(w => w.reps === 12)).toBeTruthy();
      expect(res.body.some(w => w.workout_id.user_id === user.id)).toBeTruthy();
      expect(res.body.some(w => w.workout_id.user_id === other_user.id)).toBeFalsy();
      expect(res.body.some(w => w.workout_id._id === workout_1.id)).toBeTruthy();
      expect(res.body.some(w => w.workout_id._id === workout_2.id)).toBeTruthy();
      expect(res.body.some(w => w.workout_id._id === other_workout.id)).toBeFalsy();
    });
  });

  describe('POST /', () => {
    let user, token, workout_object, custom_date;

    const response = async (object, jwt) => {
      return await request(server)
        .post('/api/workouts')
        .set('x-auth-token', jwt)
        .send(object);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123456" });
      await user.save();
      token = user.generateAuthToken();
      custom_date = new Date(2019, 10);
      workout_object = { date: custom_date };
    });
    afterEach(async () => {
      await User.deleteMany({});
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(workout_object, token);
      
      expect(res.status).toBe(401);    
    });

    it('should return 400 if workout is invalid', async () => {
      workout_object = { date: "asdfa" };
      const res = await response(workout_object, token);
      
      expect(res.status).toBe(400);
    });

    it('should save workout if workout is valid', async () => {
      const res = await response(workout_object, token);
      const workout = await Workout.findOne(workout_object);

      expect(workout).toHaveProperty('_id');
      expect(workout).toHaveProperty('date', workout_object.date);
      expect(workout).toHaveProperty('user_id', user._id);
    });

    it('should return workout if workout is valid', async () => {
      const res = await response(workout_object, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id'); 
      expect(res.body).toHaveProperty('date', workout_object.date.toJSON()); 
      expect(res.body).toHaveProperty('user_id', user.id);        
    });
  });

  describe('GET /ID', () => {
    let user, other_user, token, muscle, exercise_1, exercise_2, 
    workout, other_workout, diff_user_workout, completed_exercises;

    const response = async (w_id, jwt) => {
      return await request(server)
        .get('/api/workouts/' + w_id)
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123456" });
      await user.save();
      token = user.generateAuthToken();
      other_user = new User({ name: "binky", email: "bad@bunny.com", password_digest: "123456" });
      await other_user.save();
      muscle = new Muscle({ name: 'chest' });
      exercise_1 = new Exercise({ name: 'chest fly' , muscle_id: muscle._id });
      exercise_2 = new Exercise({ name: 'bench press', muscle_id: muscle._id });
      await exercise_1.save();
      await exercise_2.save();
      workout = new Workout({ user_id: user._id });
      other_workout = new Workout({ user_id: user._id });
      diff_user_workout = new Workout({ user_id: other_user._id });
      await workout.save();
      await other_workout.save();
      await diff_user_workout.save();
      completed_exercises = [
          { exercise_id: exercise_1._id, sets: 4, reps: 8, workout_id: workout._id }, 
          { exercise_id: exercise_2._id, sets: 4, reps: 12, workout_id: workout._id },
          { exercise_id: exercise_2._id, sets: 4, reps: 12, workout_id: other_workout._id }
        ];
      await CompletedExercise.collection.insertMany(completed_exercises);
    });
    afterEach(async () => {
      await CompletedExercise.deleteMany({});
      await Exercise.deleteMany({});
      await Workout.deleteMany({});
      await User.deleteMany({});
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(workout._id, token);

      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not current user', async () => {
      const res = await response(diff_user_workout._id, token);
      expect(res.status).toBe(403);
    });

    it('should return 404 if invalid workoutID', async () => {
      const workout_id = 1;
      const res = await response(workout_id, token);
      
      expect(res.status).toBe(404);
    });

    it('should return 404 if workoutID valid but workoutID not in DB', async () => {
      const workout_id = mongoose.Types.ObjectId();
      const res = await response(workout_id, token);
      
      expect(res.status).toBe(404);
    });

    it('should return all completed_exercises for current workout (stat code 200)', async () => {
      const res = await response(workout._id, token);
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(w => w.exercise_id.name === 'chest fly')).toBeTruthy();
      expect(res.body.some(w => w.exercise_id.name === 'bench press')).toBeTruthy();
      expect(res.body.some(w => w.sets === 4)).toBeTruthy();
      expect(res.body.some(w => w.reps === 8)).toBeTruthy();
      expect(res.body.some(w => w.reps === 12)).toBeTruthy();
      expect(res.body.some(w => w.workout_id === workout.id)).toBeTruthy();
      expect(res.body.some(w => w.workout_id === other_workout.id)).toBeFalsy();
    });
  });

  describe('PUT /ID', () => {
    let user, other_user, token, workout, 
    diff_user_workout, workout_object,
    custom_date;

    const response = async (object, w_id, jwt) => {
      return await request(server)
        .put('/api/workouts/' + w_id)
        .set('x-auth-token', jwt)
        .send(object);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123456" });
      await user.save();
      token = user.generateAuthToken();
      other_user = new User({ name: "binky", email: "bad@bunny.com", password_digest: "123456" });
      await other_user.save();

      workout = new Workout({ user_id: user._id });
      diff_user_workout = new Workout({ user_id: other_user._id });
      await workout.save();
      await diff_user_workout.save();
      custom_date = new Date(2019, 10);
      workout_object = { date: custom_date };

    });
    afterEach(async () => {
      await Workout.deleteMany({});
      await User.deleteMany({});
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(workout_object, workout._id, token);
      
      expect(res.status).toBe(401);
    });

     it('should return 403 if user is not current user', async () => {
      const res = await response(workout_object, diff_user_workout._id, token);
      
      expect(res.status).toBe(403);
    });

    it('should return 404 if invalid workoutID', async () => {
      const workout_id = 1;
      const res = await response(workout_object, workout_id, token);
      
      expect(res.status).toBe(404);
    });

    it('should return 404 if workoutID valid but workoutID not in DB', async () => {
      const workout_id = mongoose.Types.ObjectId();
      const res = await response(workout_object, workout_id, token);
      
      expect(res.status).toBe(404);
    });

    it('should return 400 if workout is invalid', async () => {
      workout_object = {};
      const res = await response(workout_object, workout._id, token);
      
      expect(res.status).toBe(400);
    });

    it('should update workout if input is valid', async () => {
      const res = await response(workout_object, workout._id, token);
      const updated_workout = await Workout.findOne(workout_object);

      expect(updated_workout).toHaveProperty('_id', workout._id);
      expect(updated_workout).toHaveProperty('date', workout_object.date);
      expect(updated_workout).toHaveProperty('user_id', workout.user_id);
    });

    it('should return updated workout if it is valid', async () => {
      const res = await response(workout_object, workout._id, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', workout.id); 
      expect(res.body).toHaveProperty('date', workout_object.date.toJSON()); 
      expect(res.body).toHaveProperty('user_id', workout.user_id.toString());    
    });
  });

  describe('DELETE /ID', () => {
    let user, other_user, token, muscle, exercise_1, exercise_2, 
    workout, other_workout, diff_user_workout, completed_exercises;

    const response = async (w_id, jwt) => {
      return await request(server)
        .delete('/api/workouts/' + w_id)
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123456" });
      await user.save();
      token = user.generateAuthToken();
      other_user = new User({ name: "binky", email: "bad@bunny.com", password_digest: "123456" });
      await other_user.save();
      muscle = new Muscle({ name: 'chest' });
      exercise_1 = new Exercise({ name: 'chest fly' , muscle_id: muscle._id });
      exercise_2 = new Exercise({ name: 'bench press', muscle_id: muscle._id });
      await exercise_1.save();
      await exercise_2.save();
      workout = new Workout({ user_id: user._id });
      other_workout = new Workout({ user_id: user._id });
      diff_user_workout = new Workout({ user_id: other_user._id });
      await workout.save();
      await other_workout.save();
      await diff_user_workout.save();
      completed_exercises = [
          { exercise_id: exercise_1._id, sets: 4, reps: 8, workout_id: workout._id }, 
          { exercise_id: exercise_2._id, sets: 4, reps: 12, workout_id: workout._id },
          { exercise_id: exercise_2._id, sets: 4, reps: 12, workout_id: other_workout._id }
        ];
      await CompletedExercise.collection.insertMany(completed_exercises);
    });
    afterEach(async () => {
      await CompletedExercise.deleteMany({});
      await Exercise.deleteMany({});
      await Workout.deleteMany({});
      await User.deleteMany({});
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(workout._id, token);

      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not current user', async () => {
      const res = await response(diff_user_workout._id, token);
      expect(res.status).toBe(403);
    });

    it('should return 404 if invalid workoutID', async () => {
      const workout_id = 1;
      const res = await response(workout_id, token);
      
      expect(res.status).toBe(404);
    });


    it('should return 404 if workoutID valid but workoutID not in DB', async () => {
      const workout_id = mongoose.Types.ObjectId();
      const res = await response(workout_id, token);
      
      expect(res.status).toBe(404);
    });

    it('should delete workout and associated completed_exercises if input is valid', async () => {
      const res = await response(workout._id, token);
      const returned_workout = await Workout.findById(workout._id);
      const returned_completed_exercises = await CompletedExercise.find({ workout_id: workout._id });

      expect(returned_workout).toBeNull();
      expect(returned_completed_exercises).toEqual([]);
    });

    it('should return deleted workout', async () => {
      const res = await response(workout._id, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', workout.id);
      expect(res.body).toHaveProperty('date');
      expect(res.body).toHaveProperty('user_id', user.id);   
    });
  });

  describe('POST /ID/Completed_Exercise/', () => {
    let user, other_user, token, muscle, 
    exercise, workout, other_workout,
    new_exercise;

    const response = async (object, w_id, jwt) => {
      return await request(server)
        .post('/api/workouts/' + w_id + '/completed_exercises/')
        .set('x-auth-token', jwt)
        .send(object);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123456" });
      await user.save();
      token = user.generateAuthToken();
      other_user = new User({ name: "binky", email: "bad@bunny.com", password_digest: "123456" });
      await other_user.save();

      muscle = new Muscle({ name: 'chest' });
      exercise = new Exercise({ name: 'chest fly' , muscle_id: muscle._id });
      await exercise.save();

      workout = new Workout({ user_id: user._id });
      other_workout = new Workout({ user_id: other_user._id });
      await workout.save();
      await other_workout.save();

      new_exercise = { 
        exercise_id: exercise._id, 
        workout_id: workout._id,
        sets: 3, 
        reps: 12, 
        weight: 225
      };
      
    });
    afterEach(async () => {
      await Muscle.deleteMany({});
      await Exercise.deleteMany({});
      await Workout.deleteMany({});
      await User.deleteMany({});
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(new_exercise, workout._id, token);
      
      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not current user (userID from JWT)', async () => {
      const res = await response(new_exercise, other_workout._id, token);
      expect(res.status).toBe(403);      
    });

    it('should return 404 if invalid workoutID', async () => {
      const workout_id = "";
      const res = await response(new_exercise, workout_id, token);
      
      expect(res.status).toBe(404);
    });

    it('should return 404 if workoutID valid but workoutID not in DB', async () => {
      const workout_id = mongoose.Types.ObjectId();
      const res = await response(new_exercise, workout_id, token);
      
      expect(res.status).toBe(404);      
    });

    it('should return 400 if invalid exerciseID ', async () => {
      const new_exercise = { exercise_id: '1', sets: 3, reps: 12, workout_id: workout._id };
      const res = await response(new_exercise, workout._id, token);

      expect(res.status).toBe(400); 
    });

    it('should return 400 if exerciseID valid but exerciseID not in DB', async () => {
      const exercise_id = mongoose.Types.ObjectId();
      const new_exercise = { exercise_id: exercise_id, sets: 3, reps: 12, workout_id: workout._id };
      const res = await response(new_exercise, workout._id, token);

      expect(res.status).toBe(400); 
    });

    it('should return 400 if completed_exercise is invalid', async () => {
      const new_exercise = { 
        exercise_id: exercise._id, 
        workout_id: workout._id,
        weight: 225
      };
      const res = await response(new_exercise, workout._id, token);

      expect(res.status).toBe(400); 
    });

    it('should update completed_exercise if input is valid', async () => {
      const res = await response(new_exercise, workout._id, token);
      const saved_exercise = await CompletedExercise.findOne(new_exercise);

      expect(saved_exercise).toHaveProperty('_id');
      expect(saved_exercise).toHaveProperty('exercise_id', exercise._id);
      expect(saved_exercise).toHaveProperty('workout_id', workout._id);
      expect(saved_exercise).toHaveProperty('sets', 3);
      expect(saved_exercise).toHaveProperty('reps', 12);
      expect(saved_exercise).toHaveProperty('weight', 225);
      expect(saved_exercise).toHaveProperty('mum', false);
    });

    it('should return updated completed_exercise if it is valid', async () => {
      const res = await response(new_exercise, workout._id, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id'); 
      expect(res.body).toHaveProperty('exercise_id', exercise.id); 
      expect(res.body).toHaveProperty('workout_id', workout.id); 
      expect(res.body).toHaveProperty('sets', 3);
      expect(res.body).toHaveProperty('reps', 12);
      expect(res.body).toHaveProperty('weight', 225);    
      expect(res.body).toHaveProperty('mum', false);   
    });
  });
});










