const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {  
  it('should return JWT that contains user_id and admin properties', () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const properties = { _id: id, admin: true };
    const user = new User(properties);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwt_private_key'));
    expect(decoded).toMatchObject(properties);
  });
});
