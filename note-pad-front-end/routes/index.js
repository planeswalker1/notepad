const express = require('express');
const request = require('request');
const app = express();

const router = express.Router();
const config = require('../app/models/config');
const auths = require('./auth');

// home page
router.get('/', function (req, res, next) {
  return res.render('index', { title: config.indexTitle });
});

// register a user
router.get('/register', function (req, res, next) {
  return res.render('register', { title: config.registerTitle });
});

router.post('/register', function (req, res, next) {
  console.log('someone requested to register');
  console.log('req.body', req.body);
  console.log('apiUrl', config.apiUrl + '/users');
  return request.post(config.apiUrl + '/users', { form: req.body }).pipe(res);
});

// login a user
router.get('/login', function (req, res, next) {
  return res.render('login', { title: config.loginTitle });
});

router.post('/login', function (req, res, next) {
  console.log('someone requested to login')
  return request.post(config.apiUrl + '/auth/token', { form: req.body }).pipe(res);
});

// logout a user
router.put('/logout', auths.userRequired, function (req, res, next) {
  console.log('somone requested to logout');
  console.log('their token', req.token);
  request.put({
    url: config.apiUrl + '/logout/',
    headers: {
      'x-access-token': req.token
    }
  }).pipe(res);
});

// user's notes page
router.get('/notes', auths.userRequired, function (req, res, next) {
  console.log('/notes hit');
  console.log('getting user from backend');
  request.get({
    url: config.apiUrl + '/users/',
    headers: {
      'x-access-token': req.token
    }
  }, function (err, response, body) {
    console.log('body in GET /notes', body);
    console.log('notes in GET /notes', JSON.parse(body).pages);
    if (response.statusCode === 200) {
      console.log('login success');
      return res.render('notes', {
        token: req.token,
        notes: JSON.parse(body).pages
      });
    } else {
      console.log('login error');
      return res.render('login', { 
        title: config.loginTitle
      });
    }
  }); 
}); 

// create a new note
router.get('/notes/create', auths.userRequired, function (req, res, next) {
  console.log('req.token in GET /notes/create', req.token);
  return res.render('createnote', {
    title: config.createTitle,
    token: req.token
  });
});

router.post('/notes', auths.userRequired, function (req, res, next) {
  console.log('req.token in POST /notes', req.token);
  request.post({
    url: config.apiUrl + '/pages',
    form: req.body,
    headers: {
      'x-access-token': req.token
    }
  }).pipe(res);
});

// TODO update a note
router.get('/notes/update/:index', function (req, res, next) {
  console.log('user requested the update page');
  return res.sendStatus(200);
});

router.put('/notes/update/:index', function (req, res, next) {
  console.log('user requested to update a page');
  return res.sendStatus(200);
});

module.exports = router;