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

  describe('DELETE /', () => {
    it('should return 400 if client not logged in', async () => {});
    it('should return 403 if user is not current user', async () => {});
    it('should return 404 if invalid ID', async () => {});
    it('should set remember_digest to nil db (stat code 200)', async () => {});
  });

});