const User = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/users', () => {
  // beforeEach(() => { server = require('../../index'); })
  // afterEach(async () => {
  //   await server.close();
  //   await User.remove({});
  // });

  describe('POST /', () => {
    it('should return 400 if request params are invalid', async () => {});
    it('should return 400 if email not in database', async () => {});
    it('should return 400 if password not in database', async () => {});
    it('should create new authToken', async () => {});
    it('should create remember_digest in db', async () => {});
    it('should return JWToken to client (stat code 200)', async () => {});
  });

});