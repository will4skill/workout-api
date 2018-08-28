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
    await server.close();
    await Muscle.deleteMany({});
    await Exercise.deleteMany({});
    await CompletedExercise.deleteMany({});
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
    it('should return 401 if client not logged in', async () => {


    });
    it('should return 400 if workout is invalid', async () => {});
    it('should save workout if workout is valid [* User -> Workout *]', async () => {
      //workout should have >= 1 completed_exercise
    });
    it('should return workout if workout is valid', async () => {});
  });

  describe('GET /ID', () => {
    let user, token, muscle, exercise_1, exercise_2, 
    workout, other_workout, completed_exercises;

    const response = async (w_id, jwt) => {
      return await request(server)
        .get('/api/workouts/' + w_id)
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123" });
      token = user.generateAuthToken();
      muscle = new Muscle({ name: 'chest' });
      exercise_1 = new Exercise({ name: 'chest fly' , muscle_id: muscle._id });
      exercise_2 = new Exercise({ name: 'bench press', muscle_id: muscle._id });
      await exercise_1.save();
      await exercise_2.save();
      workout = new Workout({ user_id: user._id });
      other_workout = new Workout({ user_id: user._id });
      await workout.save();
      await other_workout.save();
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
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(workout._id, token);

      expect(res.status).toBe(401);
    });

    // it('should return 403 if user is not current user', async () => {


    // });

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

  // describe('PUT /ID', () => {
  //   let user, token, muscle, exercise_1, exercise_2, 
  //   workout, other_workout, completed_exercises,
  //   updated_workout;

  //   const response = async (object, c_id, jwt) => {
  //     return await request(server)
  //       .put('/api/workouts/' + c_id)
  //       .set('x-auth-token', jwt)
  //       .send(object);
  //   };

  //   beforeEach(async() => {
  //     user = new User({ name: "bob", email: "bob@example.com", password_digest: "123" });
  //     token = user.generateAuthToken();
  //     muscle = new Muscle({ name: 'chest' });
  //     exercise_1 = new Exercise({ name: 'chest fly' , muscle_id: muscle._id });
  //     exercise_2 = new Exercise({ name: 'bench press', muscle_id: muscle._id });
  //     await exercise_1.save();
  //     await exercise_2.save();
  //     workout = new Workout({ user_id: user._id });
  //     other_workout = new Workout({ user_id: user._id });
  //     await workout.save();
  //     await other_workout.save();
  //     completed_exercises = [
  //         { exercise_id: exercise_1._id, sets: 4, reps: 8, workout_id: workout._id }, 
  //         { exercise_id: exercise_2._id, sets: 4, reps: 12, workout_id: workout._id },
  //         { exercise_id: exercise_2._id, sets: 4, reps: 12, workout_id: other_workout._id }
  //       ];
  //     await CompletedExercise.collection.insertMany(completed_exercises);
  //     updated_workout = {};

  //   });
  //   afterEach(async () => {
  //     await CompletedExercise.deleteMany({});
  //     await Exercise.deleteMany({});
  //     await Workout.deleteMany({});
  //   });

  //   it('should return 401 if client not logged in', async () => {
  //     token = '';
  //     const res = await response(updated_workout, workout._id, token);
      
  //     expect(res.status).toBe(401);
  //   });

  //   // it('should return 403 if user is not current user', async () => {


  //   // });

  //   it('should return 404 if invalid workoutID', async () => {
  //     const workout_id = 1;
  //     const res = await response(updated_workout, workout._id, token);
      
  //     expect(res.status).toBe(404);

  //   });

  //   it('should return 404 if workoutID valid but workoutID not in DB', async () => {
  //     const workout_id = mongoose.Types.ObjectId();
  //     const res = await response(updated_workout, workout._id, token);
      
  //     expect(res.status).toBe(404);
  //   });

  //   it('should return 400 if workout is invalid', async () => {


  //   });

  //   it('should update workout if input is valid', async () => {});
  //   it('should return updated workout if it is valid', async () => {});
  // });

  describe('DELETE /ID', () => {
    let user, token, muscle, exercise_1, exercise_2, 
    workout, other_workout, completed_exercises;

    const response = async (w_id, jwt) => {
      return await request(server)
        .delete('/api/workouts/' + w_id)
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123" });
      token = user.generateAuthToken();
      muscle = new Muscle({ name: 'chest' });
      exercise_1 = new Exercise({ name: 'chest fly' , muscle_id: muscle._id });
      exercise_2 = new Exercise({ name: 'bench press', muscle_id: muscle._id });
      await exercise_1.save();
      await exercise_2.save();
      workout = new Workout({ user_id: user._id });
      other_workout = new Workout({ user_id: user._id });
      await workout.save();
      await other_workout.save();
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
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(workout._id, token);

      expect(res.status).toBe(401);
    });

    // it('should return 403 if user is not current user', async () => {


    // });

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
});










