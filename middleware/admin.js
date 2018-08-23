function isAdmin(req, res, next) {
  if (req.user.admin == false) {
    return res.status(403).send('Forbidden');
  } else {
    next();
  }
}
module.exports = isAdmin;