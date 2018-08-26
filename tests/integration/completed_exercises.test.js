// API/workouts/:id/completed_exercises
const CompletedExercise = require('../../models/completed_exercise');
const Exercise = require('../../models/exercise');
const Muscle = require('../../models/muscle');
const Workout = require('../../models/workout');
const User = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/users', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => {
    await server.close();
    await Muscle.deleteMany({});
    await Exercise.deleteMany({});
    await CompletedExercise.deleteMany({});
  });

  describe('GET /', () => {
    let user, token, muscle, exercise_1, exercise_2, 
    workout, completed_exercises;

    const response = async (w_id, jwt) => {
      return await request(server)
        .get('/api/workouts/' + w_id + '/completed_exercises/')
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      user = new User({ name: "bob", email: "bob@example.com", password_digest: "123" });
      token = user.generateAuthToken();
      muscle = new Muscle({ name: 'chest' });
      exercise_1 = new Exercise({ name: 'chest fly' , muscle: muscle.id });
      exercise_2 = new Exercise({ name: 'bench press' , muscle: muscle.id });
      await exercise_1.save();
      await exercise_2.save();
      workout = new Workout({ user: user.id });
      await workout.save();
      completed_exercises = [
          { name: exercise_1.id, sets: 4, reps: 8, workout: workout.id }, 
          { name: exercise_2.id, sets: 4, reps: 12, workout: workout.id }
        ];
      await CompletedExercise.collection.insertMany(completed_exercises);
    });
    afterEach(async () => {
      await CompletedExercise.deleteMany({});
      await Exercise.deleteMany({});
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(workout._id, token);

      expect(res.status).toBe(401);
    });

    it('should return 400 if invalid workoutID', async () => {
      const workout_id = 1;
      const res = await response(workout_id, token);
      
      expect(res.status).toBe(400);
    });

    it('should return 400 if workoutID valid but workoutID not in DB', async () => {
      const workout_id = mongoose.Types.ObjectId();
      const res = await response(workout_id, token)
      
      expect(res.status).toBe(400);
    });

    it('should return all completed_exercises for current workout (stat code 200)', async () => {
      const res = await response(workout._id, token);
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(c => c.name.name === 'chest fly')).toBeTruthy();
      expect(res.body.some(c => c.name.name === 'bench press')).toBeTruthy();
      expect(res.body.some(c => c.sets === 4)).toBeTruthy();
      expect(res.body.some(c => c.reps === 8)).toBeTruthy();
      expect(res.body.some(c => c.reps === 12)).toBeTruthy();
      expect(res.body.some(c => c.workout === workout.id)).toBeTruthy();
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

  describe('GET /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 404 if invalid completed_exercise ID', async () => {});
    it('should return 404 if completed_exerciseID valid but completed_exerciseID not in DB', async () => {});
    it('should return specific completed_exerciseID if valid completed_exerciseID', async () => {});
  });

  describe('PUT /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 400 if completed_exercise is invalid', async () => {});
    it('should return 404 if invalid completed_exerciseID', async () => {});
    it('should return 404 if completed_exerciseID valid but completed_exerciseID not in DB', async () => {});
    it('should update completed_exercise if input is valid', async () => {});
    it('should return updated completed_exercise if it is valid', async () => {});
  });

  describe('DELETE /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not current user (userID from JWT)', async () => {});
    it('should return 404 if invalid completed_exerciseID', async () => {});
    it('return 404 if completed_exerciseID valid but completed_exerciseID not in DB', async () => {});
    it('should delete completed_exercise if input is valid', async () => {});
    it('should return deleted completed_exercise', async () => {});
  });

});




