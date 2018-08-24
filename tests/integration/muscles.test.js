const Muscle = require('../../models/muscle');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/muscles', () => {
  // beforeEach(() => { server = require('../../index'); })
  // afterEach(async () => {
  //   await server.close();
  //   await Muscle.remove({});
  // });

  describe('GET /', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return all muscles (stat code 200)', async () => {});
  });

  describe('POST /', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not admin', async () => {});
    it('should return 400 if muscle is invalid', async () => {});
    it('should save muscle if muscle is valid', async () => {});
    it('should return muscle if muscle is valid', async () => {});
  });

  describe('GET /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not admin', async () => {});
    it('should return 404 if invalid muscle ID', async () => {});
    it('should return 404 if muscleID valid but muscleID not in DB', async () => {});
    it('should return specific muscle if valid muscleID', async () => {});
  });

  describe('PUT /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not admin', async () => {});
    it('should return 400 if muscle is invalid', async () => {});
    it('should return 404 if invalid muscleID ', async () => {});
    it('should return 404 if muscleID valid but muscleID not in DB', async () => {});
    it('should update muscle if input is valid', async () => {});
    it('should return updated muscle if it is valid', async () => {});
  });

  describe('DELETE /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not admin', async () => {});
    it('should return 404 if invalid muscleID', async () => {});
    it('should return 404 if muscleID valid but muscleID not in DB', async () => {});
    it('should delete muscle if input is valid', async () => {});
    it('should return deleted muscle', async () => {});
  });

});
