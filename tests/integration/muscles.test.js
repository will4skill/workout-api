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
    const response = async (jwt) => {
      return await request(server)
        .get('/api/muscles')
        .set('x-auth-token', jwt);
    };

    it('should return 401 if client not logged in', async () => {
      const token = '';
      const res = await response(token);

      expect(res.status).toBe(401);
    });

    it('should return all muscles (stat code 200)', async () => {
      const muscles = [ { name: 'abs' }, { name: 'quads' }]
      await Muscle.collection.insertMany(muscles);
      const token = new User({ admin: false }).generateAuthToken();
      const res = await response(token);
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(u => u.name === 'abs')).toBeTruthy();
      expect(res.body.some(u => u.name === 'quads')).toBeTruthy();
    });
  });

  describe('POST /', () => {
    const response = async (object, jwt) => {
      return await request(server)
        .post('/api/muscles')
        .send(object)
        .set('x-auth-token', jwt);
    };

    it('should return 401 if client not logged in', async () => {
      const token = '';
      const user_object = { name: 'abs' }
      const res = await response(user_object, token);
      
      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const user_object = { name: 'abs' }
      const res = await response(user_object, token);

      expect(res.status).toBe(403);      
    });

    it('should return 400 if muscle is invalid', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const user_object = {};
      const res = await response(user_object, token);

      expect(res.status).toBe(400);
    });
    it('should save muscle if muscle is valid', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const user_object = { name: 'abs' }
      const res = await response(user_object, token);
      const muscle = await Muscle.findOne({ name: 'abs' });

      expect(muscle).toHaveProperty('_id');
      expect(muscle).toHaveProperty('name', 'abs');
    });

    it('should return muscle if muscle is valid', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const user_object = { name: 'abs' }
      const res = await response(user_object, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'abs');
    });
  });

  describe('GET /ID', () => {
    const response = async (id, jwt) => {
      return await request(server)
        .get('/api/muscles/' + id)
        .set('x-auth-token', jwt); 
    };

    it('should return 401 if client not logged in', async () => {
      const token = '';
      const muscle_id = '1';
      const res = await response(muscle_id, token);

      expect(res.status).toBe(401); 
    });

    it('should return 403 if user is not admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const muscle_id = '1';
      const res = await response(muscle_id, token);
      
      expect(res.status).toBe(403);  
    });

    it('should return 404 if invalid muscle ID', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const muscle_id = '1';
      const res = await response(muscle_id, token);

      expect(res.status).toBe(404); 
    });

    it('should return 404 if muscleID valid but muscleID not in DB', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const muscle_id = mongoose.Types.ObjectId();
      const res = await response(muscle_id, token);
      
      expect(res.status).toBe(404); 
    });

    it('should return specific muscle if valid muscleID', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const muscle = new Muscle({ name: 'abs' });
      await muscle.save();
      const res = await response(muscle._id, token);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', muscle._id.toHexString());
      expect(res.body).toHaveProperty('name', muscle.name);
    });
  });

  describe('PUT /ID', () => {
    const response = async (object, jwt, id) => {
      return await request(server)
        .put('/api/muscles/' + id)
        .set('x-auth-token', jwt)
        .send(object);
    };

    it('should return 401 if client not logged in', async () => {
      const token = '';
      const muscle_id = '1';
      const muscle_object = { name: 'chest' };
      const res = await response(muscle_object, token, muscle_id);
      
      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const muscle_id = '1';
      const muscle_object = { name: 'chest' };
      const res = await response(muscle_object, token, muscle_id);
      
      expect(res.status).toBe(403); 
    });

    it('should return 404 if invalid muscleID ', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const muscle_id = '1';
      const muscle_object = { name: 'chest' };
      const res = await response(muscle_object, token, muscle_id);

      expect(res.status).toBe(404); 
    });

    it('should return 404 if muscleID valid but muscleID not in DB', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const muscle_id = mongoose.Types.ObjectId();
      const muscle_object = { name: 'chest' };
      const res = await response(muscle_object, token, muscle_id);

      expect(res.status).toBe(404); 
    });

    it('should return 400 if muscle is invalid', async () => {
      const token = new User({ admin: true }).generateAuthToken();     
      const muscle = new Muscle({ name: 'chest' });
      await muscle.save();
      const muscle_object = {};
      const res = await response(muscle_object, token, muscle._id);

      expect(res.status).toBe(400); 
    });

    it('should update muscle if input is valid', async () => {
      const token = new User({ admin: true }).generateAuthToken();     
      const muscle = new Muscle({ name: 'chest' });
      await muscle.save();
      const muscle_object = { name: 'abs' };
      const res = await response(muscle_object, token, muscle._id);
      const result = await Muscle.findById(muscle._id);

      expect(result).toHaveProperty('name', 'abs');
    });

    it('should return updated muscle if it is valid', async () => {
      const token = new User({ admin: true }).generateAuthToken();     
      const muscle = new Muscle({ name: 'chest' });
      await muscle.save();
      const muscle_object = { name: 'abs' };
      const res = await response(muscle_object, token, muscle._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', muscle._id.toHexString());
      expect(res.body).toHaveProperty('name', 'abs');  
    });
  });

  describe('DELETE /ID', () => {
    const response = async (id, jwt) => {
      return await request(server)
        .delete('/api/muscles/' + id)
        .set('x-auth-token', jwt); 
    };

    it('should return 401 if client not logged in', async () => {
      const token = '';
      const muscle_id = '1';
      const res = await response(muscle_id, token);
      
      expect(res.status).toBe(401); 
    });

    it('should return 403 if user is not admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const muscle_id = '1';
      const res = await response(muscle_id, token);

      expect(res.status).toBe(403); 
    });

    it('should return 404 if invalid muscleID', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const muscle_id = '1';
      const res = await response(muscle_id, token);
      
      expect(res.status).toBe(404); 
    });

    it('should return 404 if muscleID valid but muscleID not in DB', async () => {
      const token = new User({ admin: true }).generateAuthToken();
      const muscle_id = mongoose.Types.ObjectId();
      const res = await response(muscle_id, token);

      expect(res.status).toBe(404);      
    });

    it('should delete muscle if input is valid', async () => {
      const token = new User({ admin: true }).generateAuthToken();     
      const muscle = new Muscle({ name: 'abs' });
      await muscle.save();
      const res = await response(muscle._id, token);
      const result = await Muscle.findById(muscle._id);

      expect(result).toBeNull();
    });

    it('should return deleted muscle', async () => {
      const token = new User({ admin: true }).generateAuthToken();     
      const muscle = new Muscle({ name: 'abs' });
      await muscle.save();
      const res = await response(muscle._id, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', muscle._id.toHexString());
      expect(res.body).toHaveProperty('name', muscle.name);
    });
  });

});
