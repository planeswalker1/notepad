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
  request.post(config.apiUrl + '/users', { form: req.body }).pipe(res);
});

// login a user
router.get('/login', function (req, res, next) {
  return res.render('login', { title: config.loginTitle });
});

router.post('/login', function (req, res, next) {
  console.log('someone requested to login')
  request.post(config.apiUrl + '/auth/token', { form: req.body }).pipe(res);
});

// logout a user
router.get('/logout', function (req, res, next) {
  console.log('somone requested to logout');
  console.log('their req.query.token', req.query.token);
  request.put(config.apiUrl + '/logout?token=' + req.query.token);
  return res.redirect('/');
});

// user's notes page
router.get('/notes', auths.userRequired, function (req, res, next) {  
  console.log('getting user from backend');
  request.get({
    url: config.apiUrl + '/users/',
    headers: {
      'x-access-token': req.token
    }
  }, function (err, response, body) {
    console.log('body in GET /notes', body);
    console.log('notes in GET /notes', JSON.parse(body).pages);
    var notes = JSON.parse(body).pages;
    var filteredNotes = notes.map(function (note) {
      delete note._id;
      delete note.createdDate;
      delete note.updatedDate;
      delete note.__v;
      return note;
    });
    console.log('filtered notes', filteredNotes);
    if (!err) {
      return res.render('notes', {
        token: req.token,
        notes: filteredNotes
      });
    } else {
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

module.exports = router;