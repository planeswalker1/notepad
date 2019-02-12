const express = require('express');
let router = express.Router();

const pages = require('../controllers/pages');
const auths = require('../controllers/auths');

router.route('/:id')
  .post(pages.createPage)
  .get(auths.validateToken, pages.getPageById)
  .put(auths.validateToken, pages.updatePage)
  .delete(auths.validateToken, pages.deletePageById);

router.route('/')
  .get(auths.validateToken, pages.getPages);

module.exports = router;