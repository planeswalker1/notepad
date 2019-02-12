const express = require('express');
let router = express.Router();

const users = require('../controllers/users');
const auths = require('../controllers/auths');

router.route('/')
  .post(users.createUser)
  .get(auths.validateToken, users.getUserById)
  .put(auths.validateToken, users.updateUser)
  .delete(auths.validateToken, users.deleteUserById);

  router.route('/bip')
  .get(users.getUsers)

module.exports = router;