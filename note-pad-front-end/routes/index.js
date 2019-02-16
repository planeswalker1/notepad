const express = require('express');
const request = require('request');

const router = express.Router();
const config = require('../app/models/config');

router.get('/', function (req, res, next) {
  return res.render('index', {title: config.indexTitle});
});

router.get('/register', function (req, res, next) {
  return res.render('register', {title: config.registerTitle});
});

router.post('/register', function (req, res, next) {
  console.log(req.body);
  request.post(config.apiUrl + '/users', {form:  req.body}).pipe(res);
});

router.get('/login', function (req, res, next) {
  return res.render('login', {title: config.loginTitle});
});

router.post('/login', function (req, res, next) {
  console.log(req.body);
  request.post(config.apiUrl + '/auth/token', { form: req.body }).pipe(res);
});

module.exports = router;