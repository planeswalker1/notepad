const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const config = require('./models/config');

const usersRouter = require('./routes/users.js');
const pagesRouter = require('./routes/pages.js');
const authRouter = require('./routes/auth.js');

let app = express();

// connect to mongodb
mongoose.connect(config.dbUrl, {useNewUrlParser: true});

// log if in dev
if (app.get('env') === 'development') {
  var dev = true;
}
if (dev) {
  app.use(logger('dev'));
}

// create req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ============================
// More Middleware
// ============================
app.param('id', function (req, res, next, id) {
  // check if valid db id
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).send('Invalid ID');
  }
  next();
});

// ============================
// Routes
// ============================

// crud
app.use('/users', usersRouter);
app.use('/pages', pagesRouter);
app.use('/auth', authRouter);

// development error handler
app.use(function (err, req, res, next) {
  console.log(err);
  return res.sendStatus(err.status || 500);
});

// production error handler
app.use(function (err, req, res, next) {
  return res.sendStatus(err.status || 500);
});

app.listen(config.port, function () {
  console.log('Listening at http://localhost:%s in %s mode', config.port, app.get('env'));
});