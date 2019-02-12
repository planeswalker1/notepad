const express = require('express');
const request = require('request');

const router = express.Router();
const config = require('../app/models/config');

router.get('/', function (req, res, next) {
  return res.render('index', {title: config.indexTitle});
});

router.get('/login', function (req, res, next) {
  request.get(function ())
  return res.render('login');
});

router.post('/login', function (req, res, next) {
  return res.status(200).send('worked!');
});

module.exports = router;