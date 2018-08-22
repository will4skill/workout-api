const Exercise = require('../../models/exercise');
const Muscle = require('../../models/muscle');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/users', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => {
    await server.close();
    await Exercise.remove({});
    await Muscle.remove({});
  });

  describe('GET /', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return all exercises (stat code 200)', async () => {});
  });

  describe('POST /', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not admin', async () => {});
    it('should return 400 if exercise is invalid', async () => {});
    it('should save exercise if exercise is valid [* Exercise - Muscle *]', async () => {});
    it('should return exercise if exercise is valid', async () => {}); 
  });

  describe('GET /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not admin', async () => {});
    it('should return 404 if invalid exercise ID', async () => {});
    it('should return 404 if exerciseID valid but exerciseID not in DB', async () => {});
    it('should return specific exercise if valid exerciseID', async () => {});
  });

  describe('PUT /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not admin', async () => {});
    it('should return 400 if exercise is invalid', async () => {});
    it('should return 404 if invalid exerciseID', async () => {});
    it('should return 404 if exerciseID valid but exerciseID not in DB', async () => {});
    it('should update exercise if input is valid', async () => {});
    it('should return updated exercise if it is valid', async () => {});
  });

  describe('DELETE /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not admin', async () => {});
    it('should return 404 if invalid exerciseID', async () => {});
    it('should return 404 if exerciseID valid but exerciseID not in DB', async () => {});
    it('should delete exercise if input is valid', async () => {});
    it('should return deleted exercise', async () => {});
  });

});









