const User = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/users', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  describe('GET /', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not admin', async () => {});
    it('should return all users (stat code 200)', async () => {});
  });

  describe('POST /', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 400 if user is invalid (or exists already)', async () => {});
    it('should save user if user is valid', async () => {});
    it('should return user if user is valid', async () => {});
  });

  describe('GET /ME', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 404 if invalid ID', async () => {});
    it('should return 404 if ID valid but ID not in DB', async () => {});
    it('should return specific user if valid ID', async () => {});
  });

  describe('PUT /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 400 if user is invalid', async () => {});
    it('should return 404 if invalid ID', async () => {});
    it('should return 404 if id valid but ID not in DB ', async () => {});
    it('should update user if input is valid', async () => {});
    it('should return updated user if it is valid', async () => {});
  });

  describe('DELETE /ID', () => {
    it('should return 401 if client not logged in', async () => {});
    it('should return 403 if user is not current user', async () => {});
    it('should return 404 if invalid ID', async () => {});
    it('should return 404 if id valid but ID not in DB', async () => {});
    it('should delete user if input is valid', async () => {});
    it('should return deleted user', async () => {});
  });

});