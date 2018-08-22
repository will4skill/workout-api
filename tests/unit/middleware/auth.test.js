const User = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('authorization middleware', () => {
  it('should return 401 if no JWT not included', () => {});
  it('should pass control to next middleware function if valid token and token not expired', () => {});
  it('should return 400 and pass control to next middleware function if error', () => {});
});