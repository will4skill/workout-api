const User = require('../../models/user');
const server = require('../../index');
const request = require('supertest')(server);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

describe('/api/login', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(() => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close();
    });
  });

  describe('POST /', () => {
    let user, token, salt, 
    digest, user_object;

    const response = async (object) => {
      return await request
        .post('/api/login')
        .send(object);
    };

    beforeEach(async() => {
      salt = await bcrypt.genSalt(10);
      digest = await bcrypt.hash('123456', salt);

      user = new User({ 
        name: 'bob', 
        email: 'bob@example.com', 
        password_digest: digest 
      });
      await user.save();
      token = user.generateAuthToken();

      user_object = { email: 'bob@example.com', password: '123456' };
    });

    it('should return 400 if email not in database', async () => {
      const user_object = { email: 'diffemail@example.com', password: '123456'}
      const res = await response(user_object);
      
      expect(res.status).toBe(400);
    });

    it('should return 400 if password not in database', async () => {
      const user_object = { email: 'bob@example.com', password: '1111' };
      const res = await response(user_object);
      
      expect(res.status).toBe(400);
    });


    it('should return 200 and a JSON Web Token to client', async () => {
      const res = await response(user_object);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('jwt');
    });
  });
});