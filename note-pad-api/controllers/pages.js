const Page = require('../models/schemas/page');
const User = require('../models/schemas/user');

exports.getPages = function (req, res, next) {
  Page.find({}, function (err, pages) {
    if (err) return next(err);
    
    return res.json(pages);
  });
};

exports.getPageById = function (req, res, next) {
  Page.findById(req.user.id, function (err, page) {
    if (err) return next(err);

    if (!page)return res.status(404).send('No page with that ID');
    return res.json(page);
  });
};

exports.createPage = function (req, res, next) {
  var pageData = {};
  // validate inputs
  if (req.body.name && typeof req.body.name === 'string') {
    pageData.name = req.body.name;
  }
  if (req.body.text && typeof req.body.text === 'string') {
    pageData.text = req.body.text;
  }

  // create page with pageData
  var newPage = new Page(pageData);
  newPage.save(function (err, page) {
    if (err) return next(err);

    // created page
    console.log('created page', page);
    // look for user to store page id into
    User.findById({ _id: req.user.id }, function (err, user) {
      console.log('found user to store page to', user);
      if (err) return next(err);

      if (!user) return res.status(404).send('No user with that ID');
      // add id of page to user pages
      user.pages.push(page._id);
      user.save(function (err) {
        if (err) return next(err);

        return res.sendStatus(200);
      });
    });

  });
};

exports.updatePage = function (req, res, next) {
  Page.findByIdAndUpdate(req.user.id, req.body, { new: true }, function (err, page) {
    if (err) return next(err);

    if (!page) return res.status(404).send('No user with that ID');
    return res.sendStatus(200);
  });
};

exports.deletePageById = function (req, res, next) {
  Page.findByIdAndDelete(req.body.id, function (err, page) {
    if (err) return next(err);

    if (!page) return res.status(404).send('No page with that ID');
    return res.sendStatus(200);
  });
};

