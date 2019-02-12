const express = require('express');
const path = require('path')
const logger = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');

const config = require('./app/models/config');
const routes = require('./routes/index');

const app = express();

// serve favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (app.get('env') === 'development') {
  app.locals.dev = true;
}

// view engine setup
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'pug');

// create req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// tell express to show public folder
app.use(express.static(path.join(__dirname, 'public')));

// log requests
if (app.locals.dev) {
  app.use(logger('dev'));
}

// seperate routes to external router
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
if (app.locals.dev) {
  app.use(function (err, req, res, next) {
    if (err.status !== 404) {
      console.log(err);
    }
    return res.sendStatus(err.status || 500);
  });
}

// production error handler
app.use(function (err, req, res, next) {
  return res.sendStatus(err.status || 500);
});

app.listen(config.PORT, function () {
  console.log('Listening at http://localhost:%s in %s mode', config.PORT, app.get('env'));
});