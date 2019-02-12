const User = require('../models/schemas/user');

exports.getUsers = function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) {
      return next(err);
    }

    return res.json(users);
  });
};

exports.getUserById = function (req, res, next) {
  User.findById(req.user.id)
    .populate('pages').exec(function (err, page) {
      if (err) next(err);
      console.log(page);
      return res.json(page);
    });
};

exports.createUser = function (req, res, next) {
  // validate email
  // http://emailregex.com
  if (req.body.email) {
    if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email))) {
      return res.status(400).send('Invalid email');
    }
  }

  let userData = {};
  userData.email = req.body.email;
  userData.hash = req.body.hash;
  if (req.body.firstName && typeof req.body.firstName === 'string') {
    userData.firstName = req.body.firstName;
  }
  if (req.body.lastName && typeof req.body.lastName === 'string') {
    userData.lastName = req.body.lastName;
  }
  // console.log(userData);
  let newUser = new User(userData);
  newUser.save(function (err, user) {
    if (err) {
      if (err.code === 11000) {
        return res.status(400).send('Email already registered');
      }
      return next(err);
    }
    return res.sendStatus(200);
  });
};

exports.updateUser = function (req, res, next) {
  User.findByIdAndUpdate(req.user.id, req.body, { new: true }, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(404).send('No user with that ID');
    }

    return res.sendStatus(200);
  });
};

exports.deleteUserById = function (req, res, next) {
  User.findByIdAndDelete(req.user.id, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(404).send('No user with that ID');
    }

    return res.sendStatus(200);
  });
};