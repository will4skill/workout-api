const CompletedExercise = require('../../models/completed_exercise');
const Exercise = require('../../models/exercise');
const Muscle = require('../../models/muscle');
const Workout = require('../../models/workout');
const User = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/completed_exercises', () => {
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
        .get('/api/completed_exercises')
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

    it('should return all completed_exercises for current user only (stat code 200)', async () => {
      const res = await response(token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some(c => c.exercise_id.name === 'chest fly')).toBeTruthy();
      expect(res.body.some(c => c.exercise_id.name === 'bench press')).toBeTruthy();
      expect(res.body.some(c => c.sets === 4)).toBeTruthy();
      expect(res.body.some(c => c.reps === 8)).toBeTruthy();
      expect(res.body.some(c => c.reps === 12)).toBeTruthy();
      expect(res.body.some(c => c.workout_id.user_id === user.id)).toBeTruthy();
      expect(res.body.some(c => c.workout_id.user_id === other_user.id)).toBeFalsy();
    });
  });

  describe('GET /ID', () => {
    let user, token, muscle, exercise, 
    workout, completed_exercise;

    const response = async (c_id, jwt) => {
      return await request(server)
        .get('/api/completed_exercises/' + c_id)
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123" });
      token = user.generateAuthToken();
      muscle = new Muscle({ name: 'chest' });
      exercise = new Exercise({ name: 'bench press' , muscle_id: muscle._id });
      await exercise.save();
      workout = new Workout({ user: user._id });
      await workout.save();
      completed_exercise = new CompletedExercise({ 
        exercise_id: exercise._id, 
        sets: 4, 
        reps: 8, 
        workout_id: workout._id 
      });
      await completed_exercise.save();
    });
    afterEach(async () => {
      await CompletedExercise.deleteMany({});
      await Exercise.deleteMany({});
      await Workout.deleteMany({});
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(completed_exercise._id, token);

      expect(res.status).toBe(401);
    });

    // it('should return 403 if user is not current user (userID from JWT)', async () => {

    // });

    it('should return 404 if invalid completed_exercise ID', async () => {
      const completed_exercise_id = 1;
      const res = await response(completed_exercise_id, token);
      
      expect(res.status).toBe(404);
    });

    it('should return 404 if completed_exerciseID valid but completed_exerciseID not in DB', async () => {
      const completed_exercise_id = mongoose.Types.ObjectId();
      const res = await response(completed_exercise_id, token);
      
      expect(res.status).toBe(404);
    });

    it('should return specific completed_exerciseID if valid completed_exerciseID', async () => {
      const res = await response(completed_exercise._id, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', completed_exercise.id);
      expect(res.body).toHaveProperty( 'exercise_id.name', 'bench press'); 
    });
  });

  describe('PUT /ID', () => {
    let user, token, muscle, exercise_1, exercise_2, 
    workout, completed_exercise, object;

    const response = async (object, c_id, jwt) => {
      return await request(server)
        .put('/api/completed_exercises/' + c_id)
        .set('x-auth-token', jwt)
        .send(object);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123" });
      token = user.generateAuthToken();
      muscle = new Muscle({ name: 'chest' });
      exercise_1 = new Exercise({ name: 'chest fly' , muscle_id: muscle._id });
      exercise_2 = new Exercise({ name: 'bench press' , muscle_id: muscle._id });
      await exercise_1.save();
      await exercise_2.save();
      workout = new Workout({ user: user._id });
      await workout.save();
      completed_exercise = new CompletedExercise({ 
        exercise_id: exercise_1._id, 
        sets: 4, 
        reps: 8, 
        workout_id: workout._id 
      });
      await completed_exercise.save();
      updated_exercise = { exercise_id: exercise_2._id, sets: 3, reps: 12, workout_id: workout._id };
      
    });
    afterEach(async () => {
      await CompletedExercise.deleteMany({});
      await Exercise.deleteMany({});
      await Workout.deleteMany({});
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(updated_exercise, completed_exercise._id, token);
      
      expect(res.status).toBe(401);
    });

    // it('should return 403 if user is not current user (userID from JWT)', async () => {

    // });

    it('should return 404 if invalid completed_exerciseID', async () => {
      const completed_exercise_id = 1;
      const res = await response(updated_exercise, completed_exercise_id, token);
      
      expect(res.status).toBe(404);
    });

    it('should return 404 if completed_exerciseID valid but completed_exerciseID not in DB', async () => {
      const completed_exercise_id = mongoose.Types.ObjectId();
      const res = await response(updated_exercise, completed_exercise_id, token);
      
      expect(res.status).toBe(404);      
    });

    it('should return 400 if invalid exerciseID ', async () => {
      const updated_exercise = { exercise_id: '1', sets: 3, reps: 12, workout_id: workout._id };
      const res = await response(updated_exercise, completed_exercise._id, token);

      expect(res.status).toBe(400); 
    });

    it('should return 400 if exerciseID valid but exerciseID not in DB', async () => {
      const exercise_id = mongoose.Types.ObjectId();
      const updated_exercise = { exercise_id: exercise_id, sets: 3, reps: 12, workout_id: workout._id };
      const res = await response(updated_exercise, completed_exercise._id, token);

      expect(res.status).toBe(400); 
    });

    it('should return 400 if completed_exercise is invalid', async () => {
      const updated_exercise = { exercise_id: exercise_2._id };
      const res = await response(updated_exercise, completed_exercise._id, token);

      expect(res.status).toBe(400); 
    });

    it('should update completed_exercise if input is valid', async () => {
      const res = await response(updated_exercise, completed_exercise._id, token);
      const saved_exercise = await CompletedExercise.findOne(updated_exercise);

      expect(saved_exercise).toHaveProperty('_id', completed_exercise._id);
      expect(saved_exercise).toHaveProperty('exercise_id', exercise_2._id);
      expect(saved_exercise).toHaveProperty('sets', 3);
      expect(saved_exercise).toHaveProperty('reps', 12);
      expect(saved_exercise).toHaveProperty('workout_id', workout._id);
    });

    it('should return updated completed_exercise if it is valid', async () => {
      const res = await response(updated_exercise, completed_exercise._id, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', completed_exercise.id); 
      expect(res.body).toHaveProperty('exercise_id', exercise_2.id); 
      expect(res.body).toHaveProperty('sets', 3);
      expect(res.body).toHaveProperty('reps', 12);
      expect(res.body).toHaveProperty('workout_id', workout.id);       
    });
  });

  describe('DELETE /ID', () => {
    let user, token, muscle, exercise, 
    workout, completed_exercises;

    const response = async (c_id, jwt) => {
      return await request(server)
        .delete('/api/completed_exercises/' + c_id)
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123" });
      token = user.generateAuthToken();
      muscle = new Muscle({ name: 'chest' });
      exercise = new Exercise({ name: 'bench press' , muscle_id: muscle._id });
      await exercise.save();
      workout = new Workout({ user: user._id });
      await workout.save();
      completed_exercise = new CompletedExercise({ 
        exercise_id: exercise._id, 
        sets: 4, 
        reps: 8, 
        workout_id: workout._id 
      });
      await completed_exercise.save();
    });
    afterEach(async () => {
      await CompletedExercise.deleteMany({});
      await Exercise.deleteMany({});
      await Workout.deleteMany({});
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(completed_exercise._id, token);

      expect(res.status).toBe(401);
    });

    // it('should return 403 if user is not current user (userID from JWT)', async () => {

    // });

    it('should return 404 if invalid completed_exerciseID', async () => {
      const completed_exercise_id = 1;
      const res = await response(completed_exercise_id, token);
      
      expect(res.status).toBe(404);
    });

    it('return 404 if completed_exerciseID valid but completed_exerciseID not in DB', async () => {
      const completed_exercise_id = mongoose.Types.ObjectId();
      const res = await response(completed_exercise_id, token);
      
      expect(res.status).toBe(404);
    });

    it('should delete completed_exercise if input is valid', async () => {
      const res = await response(completed_exercise._id, token);
      const result = await CompletedExercise.findById(completed_exercise._id);

      expect(result).toBeNull();
    });

    it('should return deleted completed_exercise', async () => {
      const res = await response(completed_exercise._id, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', completed_exercise.id);
      expect(res.body).toHaveProperty( 'exercise_id.name', 'bench press');       
    });
  });
});


// describe('POST /', () => {
//   it('should return 401 if client not logged in', async () => {});
//   it('should return 400 if completed_exercise is invalid', async () => {});
//   it('should save completed_exercise if completed_exercise is valid [* Workout -> CompletedExercise *]', async () => {
//     //    a. completed_exercise should have an associated workout
//   });
//   it('should return completed_exercise if completed_exercise is valid', async () => {});
// });

