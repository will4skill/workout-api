const Muscle = require('../../models/muscle');
const User = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/muscles', () => {
  beforeEach(() => { 
    server = require('../../index'); 
  })
  afterEach(async () => {
    await server.close();
    await Muscle.deleteMany({});
  });

  describe('GET /', () => {
    it('should return 401 if client not logged in', async () => {
      const res = await request(server).get('/api/muscles');
      expect(res.status).toBe(401);
    });

    it('should return all muscles (stat code 200)', async () => {
      const muscles = [ { name: 'abs' }, { name: 'quads' }]
      await Muscle.collection.insertMany(muscles);
      const token = new User({ admin: false }).generateAuthToken();
      const res = await request(server)
                  .get('/api/muscles')
                  .set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(u => u.name === 'abs')).toBeTruthy();
      expect(res.body.some(u => u.name === 'quads')).toBeTruthy();
    });
  });

  describe('POST /', () => {
    it('should return 401 if client not logged in', async () => {
      const res = await request(server).post('/api/muscles');
      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const res = await request(server)
                  .post('/api/muscles')
                  .set('x-auth-token', token);
      expect(res.status).toBe(403);      
    });

    it('should return 400 if muscle is invalid', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
            .post('/api/muscles')
            .send({})
            .set('x-auth-token', token);
      expect(res.status).toBe(400);
    });
    it('should save muscle if muscle is valid', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
            .post('/api/muscles')
            .send({name: 'abs'})
            .set('x-auth-token', token);
      const muscle = await Muscle.findOne({ name: 'abs' });
      expect(muscle).toHaveProperty('_id');
      expect(muscle).toHaveProperty('name', 'abs');
    });

    it('should return muscle if muscle is valid', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
            .post('/api/muscles')
            .send({name: 'abs'})
            .set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'abs');
    });
  });

  describe('GET /ID', () => {
    it('should return 401 if client not logged in', async () => {
      const res = await request(server).get('/api/muscles/1');
      expect(res.status).toBe(401); 
    });
    it('should return 403 if user is not admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const res = await request(server)
                  .get('/api/muscles/1')
                  .set('x-auth-token', token);
      expect(res.status).toBe(403);  
    });
    it('should return 404 if invalid muscle ID', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .get('/api/muscles/1')
                  .set('x-auth-token', token);
      expect(res.status).toBe(404); 
    });
    it('should return 404 if muscleID valid but muscleID not in DB', async () => {
      const id = mongoose.Types.ObjectId();
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .get('/api/muscles/' + id)
                  .set('x-auth-token', token);
      expect(res.status).toBe(404); 
    });
    it('should return specific muscle if valid muscleID', async () => {
      const muscle = new Muscle({ name: 'abs' });
      const id = muscle._id;
      await muscle.save();
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .get('/api/muscles/' + id)
                  .set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', muscle._id.toHexString());
      expect(res.body).toHaveProperty('name', muscle.name);
    });
  });

  describe('PUT /ID', () => {
    it('should return 401 if client not logged in', async () => {
      const res = await request(server).put('/api/muscles/1');
      expect(res.status).toBe(401);
    });
    it('should return 403 if user is not admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const res = await request(server)
                  .put('/api/muscles/1')
                  .set('x-auth-token', token);
      expect(res.status).toBe(403); 
    });
    it('should return 404 if invalid muscleID ', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .put('/api/muscles/1')
                  .set('x-auth-token', token);
      expect(res.status).toBe(404); 
    });
    it('should return 404 if muscleID valid but muscleID not in DB', async () => {
      const id = mongoose.Types.ObjectId();
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .put('/api/muscles/' + id)
                  .set('x-auth-token', token)
                  .send({name: 'abs'});
      expect(res.status).toBe(404); 
    });
    it('should return 400 if muscle is invalid', async () => {
      const muscle = new Muscle({ name: 'abs' });
      const id = muscle._id;
      await muscle.save();
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .put('/api/muscles/' + id)
                  .set('x-auth-token', token)
                  .send({});
      expect(res.status).toBe(400); 
    });
    it('should update muscle if input is valid', async () => {
      const muscle = new Muscle({ name: 'abs' });
      const id = muscle._id;
      await muscle.save();
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .put('/api/muscles/' + id)
                  .set('x-auth-token', token)
                  .send({name: 'chest'});
      const result = await Muscle.findById(id);
      expect(result).toHaveProperty('name', 'chest');
    });

    it('should return updated muscle if it is valid', async () => {
      const muscle = new Muscle({ name: 'abs' });
      const id = muscle._id;
      await muscle.save();
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .put('/api/muscles/' + id)
                  .set('x-auth-token', token)
                  .send({name: 'chest'});
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', muscle._id.toHexString());
      expect(res.body).toHaveProperty('name', 'chest');  
    });
  });

  describe('DELETE /ID', () => {
    it('should return 401 if client not logged in', async () => {
      const res = await request(server).delete('/api/muscles/1');
      expect(res.status).toBe(401); 
    });
    it('should return 403 if user is not admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const res = await request(server)
                  .delete('/api/muscles/1')
                  .set('x-auth-token', token);
      expect(res.status).toBe(403); 
    });
    it('should return 404 if invalid muscleID', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .delete('/api/muscles/1')
                  .set('x-auth-token', token);
      expect(res.status).toBe(404); 
    });
    it('should return 404 if muscleID valid but muscleID not in DB', async () => {
      const id = mongoose.Types.ObjectId();
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .delete('/api/muscles/' + id)
                  .set('x-auth-token', token);
      expect(res.status).toBe(404);      
    });
    it('should delete muscle if input is valid', async () => {
      const muscle = new Muscle({ name: 'abs' });
      const id = muscle._id;
      await muscle.save();
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .delete('/api/muscles/' + id)
                  .set('x-auth-token', token);
      const result = await Muscle.findById(id);
      expect(result).toBeNull();
    });
    it('should return deleted muscle', async () => {
      const muscle = new Muscle({ name: 'abs' });
      const id = muscle._id;
      await muscle.save();
      const token = new User({ admin: true }).generateAuthToken();
      const res = await request(server)
                  .delete('/api/muscles/' + id)
                  .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', muscle._id.toHexString());
      expect(res.body).toHaveProperty('name', muscle.name);
    });
  });

});
