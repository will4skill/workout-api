const Exercise = require('../../models/exercise');
const Muscle = require('../../models/muscle');
const User = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/users', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => {
    await server.close();
    await Exercise.deleteMany({});
    await Muscle.deleteMany({});
  });

  describe('GET /', () => {
    let muscle, exercises, token;
    
    const response = async (jwt) => {
      return await request(server)
        .get('/api/exercises')
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      muscle = new Muscle({ name: 'chest' });
      await muscle.save();
      exercises = [
          { name: 'chest fly' , muscle_id: muscle._id }, 
          { name: 'bench press', muscle_id: muscle._id }
        ];
      await Exercise.collection.insertMany(exercises);
      token = new User().generateAuthToken();
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(token);

      expect(res.status).toBe(401);
    });

    it('should return all exercises (stat code 200)', async () => {
      const res = await response(token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(e => e.name === 'chest fly')).toBeTruthy();
      expect(res.body.some(e => e.name === 'bench press')).toBeTruthy();
      expect(res.body.some(e => e.muscle_id === muscle.id)).toBeTruthy();
    });
  });

  describe('POST /', () => {
    let token, muscle, exercise_object;

    const response = async (object, jwt) => {
      return await request(server)
        .post('/api/exercises')
        .send(object)
        .set('x-auth-token', jwt);
    };

    beforeEach(async() => {
      token = new User({ admin: true }).generateAuthToken();
      muscle = new Muscle({ name: 'chest' });
      await muscle.save();
      exercise_object = { name: 'bench press', muscle_id: muscle._id };
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(exercise_object, token);
      
      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      token = new User({ admin: false }).generateAuthToken();
      const res = await response(exercise_object, token);

      expect(res.status).toBe(403); 
    });

    it('should return 400 if exercise is invalid', async () => {
      exercise_object = {};
      const res = await response(exercise_object, token);
      
      expect(res.status).toBe(400);
    });

    it('should return 400 if invalid muscleID', async () => {
      exercise_object = { name: 'bench press', muscle_id: '1' };
      const res = await response(exercise_object, token);
      
      expect(res.status).toBe(400);
    });

    it('should return 400 if muscleID valid but muscleID not in DB', async () => {
      const muscle_id = mongoose.Types.ObjectId();
      exercise_object = { name: 'bench press', muscle_id: muscle_id };
      const res = await response(exercise_object, token);
      
      expect(res.status).toBe(400);
    });

    it('should save exercise if exercise is valid', async () => {
      const res = await response(exercise_object, token);
      const exercise = await Exercise.findOne({ name: 'bench press', muscle_id: muscle._id });

      expect(exercise).toHaveProperty('_id');
      expect(exercise).toHaveProperty('name', 'bench press');
      expect(exercise).toHaveProperty('muscle_id', muscle._id);
    });

    it('should return exercise if exercise is valid', async () => {
      const res = await response(exercise_object, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id'); 
      expect(res.body).toHaveProperty('name', 'bench press'); 
      expect(res.body).toHaveProperty('muscle_id', muscle._id.toHexString());        
    }); 
  });

  describe('GET /ID', () => {
    let token, muscle, exercise;
    const response = async (id, jwt) => {
      return await request(server)
        .get('/api/exercises/' + id)
        .set('x-auth-token', jwt); 
    };

    beforeEach(async() => {
      token = new User({ admin: true }).generateAuthToken();
      muscle = new Muscle({ name: 'chest' });
      await muscle.save();
      exercise = new Exercise({ name: 'bench press', muscle_id: muscle._id });
      await exercise.save();
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(exercise._id, token);

      expect(res.status).toBe(401); 
    });

    it('should return 403 if user is not admin', async () => {
      token = new User({ admin: false }).generateAuthToken();
      const res = await response(exercise._id, token);
      
      expect(res.status).toBe(403); 
    });

    it('should return 404 if invalid exercise ID', async () => {
      const exercise_id = '1';
      const res = await response(exercise_id, token);

      expect(res.status).toBe(404); 
    });

    it('should return 404 if exerciseID valid but exerciseID not in DB', async () => {
      const exercise_id = mongoose.Types.ObjectId();
      const res = await response(exercise_id, token);
      
      expect(res.status).toBe(404); 
    });

    it('should return specific exercise if valid exerciseID', async () => {
      const res = await response(exercise._id, token);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id'); 
      expect(res.body).toHaveProperty('name', 'bench press'); 
      expect(res.body).toHaveProperty('muscle_id', muscle._id.toHexString());  
    });
  });

  describe('PUT /ID', () => {
    let token, muscle, new_muscle, exercise, updated_exercise;

    const response = async (object, jwt, id) => {
      return await request(server)
        .put('/api/exercises/' + id)
        .set('x-auth-token', jwt)
        .send(object);
    };

    beforeEach(async() => {
      token = new User({ admin: true }).generateAuthToken();
      muscle = new Muscle({ name: 'chest' });
      await muscle.save();
      new_muscle = new Muscle({ name: 'abs' });
      await new_muscle.save();
      exercise = new Exercise({ name: 'bench press', muscle_id: muscle._id });
      await exercise.save();
      updated_exercise = { name: 'crunches', muscle_id: new_muscle._id };
    });

    it('should return 401 if client not logged in', async () => {
      token = '';
      const res = await response(updated_exercise, token, exercise._id);
      
      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      token = new User({ admin: false }).generateAuthToken();
      const res = await response(updated_exercise, token, exercise._id);
      
      expect(res.status).toBe(403); 
    });

    it('should return 404 if invalid exerciseID', async () => {
      const exercise_id = '1';
      const res = await response(updated_exercise, token, exercise_id);

      expect(res.status).toBe(404); 
    });

    it('should return 404 if exerciseID valid but exerciseID not in DB', async () => {
      const exercise_id = mongoose.Types.ObjectId();
      const res = await response(updated_exercise, token, exercise_id);

      expect(res.status).toBe(404); 
    });

    it('should return 400 if invalid muscleID ', async () => {
      updated_exercise = { name: 'crunches', muscle_id: '1' };
      const res = await response(updated_exercise, token, exercise._id);

      expect(res.status).toBe(400); 
    });

    it('should return 400 if muscleID valid but muscleID not in DB', async () => {
      const muscle_id = mongoose.Types.ObjectId();
      updated_exercise = { name: 'crunches', muscle_id: muscle_id };
      const res = await response(updated_exercise, token, exercise._id);

      expect(res.status).toBe(400); 
    });

    it('should return 400 if exercise is invalid', async () => {
      updated_exercise = { muscle_id: new_muscle._id };
      const res = await response(updated_exercise, token, exercise._id);
      expect(res.status).toBe(400); 
    });

    it('should update exercise if input is valid', async () => {
      const res = await response(updated_exercise, token, exercise._id);
      const saved_exercise = await Exercise.findOne({ name: 'crunches', muscle_id: new_muscle._id });

      expect(saved_exercise).toHaveProperty('_id');
      expect(saved_exercise).toHaveProperty('name', 'crunches');
      expect(saved_exercise).toHaveProperty('muscle_id', new_muscle._id);
    });

    it('should return updated exercise if it is valid', async () => {
      const res = await response(updated_exercise, token, exercise._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', exercise.id); 
      expect(res.body).toHaveProperty('name', 'crunches'); 
      expect(res.body).toHaveProperty('muscle_id', new_muscle._id.toHexString()); 
    });
  });

  describe('DELETE /ID', () => {
    let token, muscle, exercise;
    const response = async (id, jwt) => {
      return await request(server)
        .delete('/api/exercises/' + id)
        .set('x-auth-token', jwt); 
    };

    beforeEach(async() => {
      token = new User({ admin: true }).generateAuthToken();
      muscle = new Muscle({ name: 'chest' });
      await muscle.save();
      exercise = new Exercise({ name: 'bench press', muscle_id: muscle._id });
      await exercise.save();
    });

    it('should return 401 if client not logged in', async () => {
      const token = '';
      const res = await response(exercise._id, token);

      expect(res.status).toBe(401); 
    });

    it('should return 403 if user is not admin', async () => {
      const token = new User({ admin: false }).generateAuthToken();
      const res = await response(exercise._id, token);
      
      expect(res.status).toBe(403); 
    });

    it('should return 404 if invalid exerciseID', async () => {
      const exercise_id = '1';
      const res = await response(exercise_id, token);

      expect(res.status).toBe(404); 
    });

    it('should return 404 if exerciseID valid but exerciseID not in DB', async () => {
      const exercise_id = mongoose.Types.ObjectId();
      const res = await response(exercise_id, token);
      
      expect(res.status).toBe(404); 
    });

    it('should delete exercise if input is valid', async () => {
      const res = await response(exercise._id, token);
      const result = await Exercise.findById(exercise._id);

      expect(result).toBeNull();
    });

    it('should return deleted exercise', async () => {
      const res = await response(exercise._id, token);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id'); 
      expect(res.body).toHaveProperty('name', 'bench press'); 
      expect(res.body).toHaveProperty('muscle_id', muscle._id.toHexString()); 
    });
  });
});