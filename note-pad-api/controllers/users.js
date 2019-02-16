const User = require('../models/schemas/user');

exports.getUsers = function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) return next(err);

    return res.json(users);
  });
};

exports.getUserById = function (req, res, next) {
  // TODO check if populating pages work
  User.findById(req.params.id)
    .populate('pages')
    .exec(function (err, user) {
      if (err) next(err);
    
      console.log('found user', user);
      return res.json(user);
    });
};

exports.createUser = function (req, res, next) {
  console.log('createUser called');
  // validate inputs
  // http://emailregex.com
  if (!req.body.email || !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email))) {
    return res.status(400).send('Invalid email');
  }
  if (!req.body.password && !req.body.hash) {
    return res.status(400).send('Missing password');
  }

  // create userData from req
  var userData = {};
  userData.email = req.body.email;
  if (req.body.password) userData.hash = req.body.password;
  if (req.body.hash) userData.hash = req.body.hash;
  // create new user
  console.log('userData for new user', userData)
  var newUser = new User(userData);
  newUser.save(function (err, user) {
    if (err) {
      if (err.code === 11000) return res.status(400).send('Email already registered');
      return next(err);
    }

    return res.sendStatus(200);
  });
};

exports.updateUserById = function (req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
    if (err) return next(err);
    
    if (!user) return res.status(404).send('No user with that ID');
    return res.sendStatus(200);
  });
};

exports.deleteUserById = function (req, res, next) {
  User.findByIdAndDelete(req.params.id, function (err, user) {
    if (err) return next(err);

    if (!user) return res.status(404).send('No user with that ID');
    return res.sendStatus(200);
  });
};