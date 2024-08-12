const passport = require('passport');
const httpStatus = require('http-status');

// handleJWT with roles
const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  if (err || !user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }

  req.user = user;

  if (roles && !roles.includes(user.role)) {
    return res.status(httpStatus.FORBIDDEN).json({ message: 'Forbidden' });
  }

  return next();
};

// Exports the middleware
const authorize = roles => (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, handleJWT(req, res, next, roles))(req, res, next);
};

module.exports = authorize;
