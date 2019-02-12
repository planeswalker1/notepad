const jwt = require('jsonwebtoken');
const User = require('../models/schemas/user');

const config = require('../models/config');

// this route is going to create a token and assign it to a user
// this works as signing in a user
exports.loginUser = function (req, res, next) {

  console.log('user logging in');
  console.log('req.body from back end', req.body);
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return next(err);
    console.log('found user');
    console.log('user', user);
    if (!user) return res.status(404).send('No user with that email');

    User.comparePassword(req.body.hash, function (err, isMatch) {
      if (err) return next(err);
      if (!isMatch) return res.status(401).send('Incorrect password');

      let payload = {
        id: user._id,
        email: user.email
      };

      let token = jwt.sign(payload, config.secret);
      user.token = token;

      user.save(function (err, user) {
        if (err) return next(err);
        return res.json({token: token});
      });
    });
  });
}

exports.validateToken = function (req, res, next) {
  let token = req.headers['Authorization'];
  if (!token) return res.status(403).send('this endpoint requires a token');
  try {
    var decoded = jwt.verify(token, config.secret);
  } catch (err) {
    return res.status(403).send('Failed to authenticate token');
  }

  User.findById(decoded.id, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(403).send('Invalid user');
    if (token !== user.token) return res.status(403).send('Expired token');
    req.user = decoded;
    next();
  });
}