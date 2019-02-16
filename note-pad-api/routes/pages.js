const express = require('express');
let router = express.Router();

const pages = require('../controllers/pages');
const auths = require('../controllers/auths');


router.route('/:id')
.post(pages.createPage)
.get(pages.getPageById)
.put(pages.updatePage)
.delete(pages.deletePageById);

router.route('/')
  .get(auths.validateToken, pages.getPages);

module.exports = router;