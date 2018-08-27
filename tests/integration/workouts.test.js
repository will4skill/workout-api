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
    it('should return 401 if client not logged in', async () => {

    });

    it('should return all workouts for current user (stat code 200)', async () => {

    });
  });

  describe('POST /', () => {
    it('should return 401 if client not logged in', async () => {});
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
      exercise_2 = new Exercise({ name: 'bench press' , muscle_id: muscle._id });
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
    it('should return 401 if client not logged in', async () => {});
    it('should return 400 if workout is invalid', async () => {});
    it('should return 404 if invalid workoutID', async () => {});
    it('should return 404 if workoutID valid but workoutID not in DB', async () => {});
    it('should update workout if input is valid', async () => {});
    it('should return updated workout if it is valid', async () => {});
  });

  describe('DELETE /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not current user', async () => {});
    it('should return 404 if invalid workoutID', async () => {});
    it('should return 404 if workoutID valid but workoutID not in DB', async () => {});
    it('should delete workout if input is valid', async () => {});
    it('should return deleted workout', async () => {});
  });

});











