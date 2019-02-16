const express = require('express');
let router = express.Router();

const users = require('../controllers/users');
const auths = require('../controllers/auths');

router.route('/:id')
  .get(users.getUserById)
  .put(users.updateUserById)
  .delete(users.deleteUserById);

router.route('/')
  .get(users.getUsers)
  .post(users.createUser)

module.exports = router;