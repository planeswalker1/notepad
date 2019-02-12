const Page = require('../models/schemas/page');
const User = require('../models/schemas/user');

exports.getPages = function (req, res, next) {
  Page.find({}, function (err, pages) {
    if (err) {
      return next(err);
    }

    return res.json(pages);
  });
};

exports.getPageById = function (req, res, next) {
  Page.findById(req.params.id, function (err, page) {
    if (err) {
      return next(err);
    }

    if (!page) {
      return res.status(404).send('No page with that ID')
    }
    return res.json(page);
  });
};

exports.createPage = function (req, res, next) {
  let pageData = {};

  if (req.body.name && typeof req.body.name === 'string') {
    pageData.name = req.body.name;
  }
  if (req.body.text && typeof req.body.text === 'string') {
    pageData.text = req.body.text;
  }

  let newPage = new Page(pageData);
  newPage.save(function (err, page) {
    if (err) return next(err);
    console.log(page);
    User.findById({ _id: req.params.id }, function (err, user) {
      console.log(user);
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
  Page.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, page) {
    if (err) {
      return next(err);
    }

    if (!page) {
      return res.status(404).send('No user with that ID');
    }

    return res.sendStatus(200);
  });
};

exports.deletePageById = function (req, res, next) {
  Page.findByIdAndDelete(req.body.id, function (err, page) {
    if (err) {
      return next(err);
    }

    if (!page) {
      return res.status(404).send('No page with that ID');
    }

    return res.sendStatus(200);
  });
};

