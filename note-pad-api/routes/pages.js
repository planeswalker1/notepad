const express = require('express');
const app = express();

let router = express.Router();

const pages = require('../controllers/pages');
const auths = require('../controllers/auths');

router.route('/')
  // .get(pages.getPageById)
  .post(auths.validateToken, pages.createPage);
  // .put(pages.updatePage)
  // .delete(pages.deletePageById);

module.exports = router;