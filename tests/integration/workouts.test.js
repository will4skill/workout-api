const Workout = require('../../models/workout');
const User = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/users', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => {
    await server.close();
    await Workout.deleteMany({});
    await Exercise.deleteMany({});
    await User.deleteMany({});
  });

  describe('GET /', () => {
    let muscle, exercises, token;
    
    const response = async (jwt) => {
      return await request(server)
        .get('/api/workouts')
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      muscle = new Muscle({ name: 'chest' });
      await muscle.save();
      exercises = [
          { name: 'chest fly' , muscle: muscle.id }, 
          { name: 'bench press', muscle: muscle.id }
        ];
      await Exercise.collection.insertMany(exercises);

      workout = new Workout({ });

      token = new User().generateAuthToken();
    });

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
    it('should return 401 if client not logged in', async () => {});
    it('should return 404 if invalid workout ID', async () => {});
    it('should return 404 if workoutID valid but workoutID not in DB', async () => {});
    it('should return specific workout if valid workoutID', async () => {});
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


