// API/workouts/:id/completed_exercises
const CompletedExercise = require('../../models/completed_exercise');
const Workout = require('../../models/workout');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/users', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => {
    await server.close();
    await CompletedExercise.remove({});
    await Workout.remove({});
  });

  describe('GET /', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return all completed_exercises for current workout (stat code 200)', async () => {});
  });

  describe('POST /', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 400 if completed_exercise is invalid', async () => {});
    it('should save completed_exercise if completed_exercise is valid [* Workout -> CompletedExercise *]', async () => {
      //    a. completed_exercise should have an associated workout
    });
    it('should return completed_exercise if completed_exercise is valid', async () => {});
  });

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




