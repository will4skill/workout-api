const User = require('../../../models/user');
const admin = require('../../../middleware/admin');
const mongoose = require('mongoose');

describe('authorization middleware', () => {
  it('should return 403 and pass control to next middleware function if not admin', () => {});
});
