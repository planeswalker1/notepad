const jwt = require('jsonwebtoken');
const User = require('../models/schemas/user');
const config = require('../models/config');

// this function is going to create a token and assign it to a user
// this works by checking:
  // if the request has a email and password
  // check the user db for a user with that email
  // check if the passwords match
  // if all are true
    // create and return a token containing the users: id, and notes

exports.loginUser = function (req, res, next) {

  console.log('user requesting to log in');
  console.log('req.body.email from front end', req.body.email);
  console.log('req.body.password from front end', req.body.password);

  console.log('checking if email and password exist');
  if (typeof req.body.email !== 'string') return res.status(400).send('Missing email');
  if (typeof req.body.password !== 'string') return res.status(400).send('Missing password');

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(400).send('No user with that email');

    console.log('found user', user);
    console.log('comparing password');
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (err) return next(err);
      if (!isMatch) return res.status(401).send('Incorrect password');

      console.log('creating token');
      var payload = {
        id: user._id,
        email: user.email,
        notes: user.notes
      };

      var token = jwt.sign(payload, config.secret);
      user.token = token;

      user.save(function (err, user) {
        if (err) return next(err);

        console.log('sending token');
        return res.json({token: token});
      });
    });
  });
}

// this function is going to seaerch for a token in the req.body, url, or headers
// try to decode the token
  // set req.user to decoded token
// else
  // return 403 error
// send to next middleware transporting the token
exports.validateToken = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) return res.status(403).send('This endpoint requires a token');

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