const User = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/users', () => {
  beforeEach(() => { 
    server = require('../../index'); 
  })
  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });

  describe('GET /', () => {
    it('should return 401 if client not logged in', async () => {
      const res = await request(server).get('/api/users');
      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const res = await request(server)
                  .get('/api/users')
                  .set('x-auth-token', token);
      expect(res.status).toBe(403);

    });

    it('should return all users (stat code 200)', async () => {
      const users = [
        { name: 'bob' , email: 'bob@example.com' },
        { name: 'tom' , email: 'tom@example.com' }
      ]
      await User.collection.insertMany(users);
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .get('/api/users')
                  .set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(u => u.name === 'bob')).toBeTruthy();
      expect(res.body.some(u => u.email === 'bob@example.com')).toBeTruthy();
      expect(res.body.some(u => u.name === 'tom')).toBeTruthy();
      expect(res.body.some(u => u.email === 'tom@example.com')).toBeTruthy();

    });
  });

  describe('POST /', () => {

    it('should return 400 if user is invalid', async () => {
      const res = await request(server)
            .post('/api/users')
            .send({name: '', email: 'bob@example.com', password: '123'});
      expect(res.status).toBe(400);
    });

    it('should return 400 if user exists already', async () => {
      const first_user = new User({name: 'bob' , email: 'bob@example.com', password_digest: '123456'});
      await first_user.save();
      const res = await request(server)
            .post('/api/users')
            .send({name: 'bob' , email: 'bob@example.com', password: '123456'});
      expect(res.status).toBe(400);  
    });

    it('should save user if user is valid', async () => {
      const res = await request(server)
            .post('/api/users')
            .send({name: 'bob' , email: 'bob@example.com', password: '123456'});
      const user = await User.findOne({ name: 'bob' });
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('name', 'bob');
      expect(user).toHaveProperty('email', 'bob@example.com');
      expect(user).toHaveProperty('password_digest');
    });

    it('should return jwt if user is valid', async () => {
      const res = await request(server)
            .post('/api/users')
            .send({name: 'bob' , email: 'bob@example.com', password: '123456'});
      expect(res.header).toHaveProperty('x-auth-token');
    });
  });

  describe('GET /ME', () => {
    it('should return 401 if client not logged in', async () => {
      const res = await request(server).get('/api/users/me');
      expect(res.status).toBe(401);
    });
    it('should return specific user if valid ID', async () => {
      const user = new User({ name: 'bob' , email: 'bob@example.com' , password_digest: '123456'});
      const token = user.generateAuthToken();
      await user.save();
      
      const res = await request(server).get('/api/users/me').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', user.name);
      expect(res.body).toHaveProperty('email', user.email);
    });
  });

  describe('PUT /ME', () => {
    it('should return 401 if client not logged in', async () => {
      const res = await request(server).put('/api/users/me');
      expect(res.status).toBe(401);      
    });
    it('should return 400 if user is invalid', async () => {
      const user = new User({ name: 'bob' , email: 'bob@example.com' , password_digest: '123456'});
      const token = user.generateAuthToken();
      await user.save();
      const res = await request(server).put('/api/users/me').set('x-auth-token', token).send({ name: ''});
      expect(res.status).toBe(400); 
    });
    it('should update user if input is valid', async () => {
      const user = new User({ name: 'bob' , email: 'bob@example.com' , password_digest: '123456'});
      const token = user.generateAuthToken();
      await user.save();
      const res = await request(server).put('/api/users/me').set('x-auth-token', token).send({ name: 'binky', email: 'binky@badbunny.com'});
      const result = await User.findById(user.id);
      expect(result).toHaveProperty('name', 'binky');
    });
    it('should return updated user if it is valid', async () => {
      const user = new User({ name: 'bob' , email: 'bob@example.com' , password_digest: '123456'});
      const token = user.generateAuthToken();
      await user.save();
      const res = await request(server).put('/api/users/me').set('x-auth-token', token).send({ name: 'binky', email: 'binky@badbunny.com'});
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'binky');
      expect(res.body).toHaveProperty('email', 'binky@badbunny.com');
    });
  });

  describe('DELETE /ID', () => {
    it('should return 401 if client not logged in', async () => {
      const res = await request(server).delete('/api/users/1');
      expect(res.status).toBe(401);  
    });
    it('should return 403 if user is not an admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const res = await request(server)
                  .delete('/api/users/1')
                  .set('x-auth-token', token);
      expect(res.status).toBe(403);
    });
    it('should return 404 if invalid ID', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .delete('/api/users/1')
                  .set('x-auth-token', token); 
      expect(res.status).toBe(404);
    });
    it('should return 404 if id valid but ID not in DB', async () => {
      const id = mongoose.Types.ObjectId();
      const user = new User({ name: 'bob' , email: 'bob@example.com', admin: true, password_digest: '123456'});
      await user.save();
      const token = user.generateAuthToken();

      const res = await request(server)
                  .delete('/api/users/' + id)
                  .set('x-auth-token', token); 
      expect(res.status).toBe(404);      
    });
    it('should delete user if input is valid', async () => {
      const user = new User({ name: 'bob' , email: 'bob@example.com', admin: true, password_digest: '123456'});
      const id = user._id;
      await user.save();
      const token = user.generateAuthToken();
      const res = await request(server)
                  .delete('/api/users/' + id)
                  .set('x-auth-token', token); 
      
      const result = await User.findById(id);
      expect(result).toBeNull();
    });
    it('should return deleted user', async () => {
      const user = new User({ name: 'bob' , email: 'bob@example.com', admin: true, password_digest: '123456' });
      const id = user._id;
      await user.save();
      const token = user.generateAuthToken();
      const res = await request(server)
                  .delete('/api/users/' + id)
                  .set('x-auth-token', token); 
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', user._id.toHexString());
      expect(res.body).toHaveProperty('name', user.name);
      expect(res.body).toHaveProperty('email', user.email);
    });
  });

});