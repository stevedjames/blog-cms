var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
var Category = require("../models/Category");

router.get('/',  function(req, res) {
    var token = req.headers;
    if (token) {
      Category.find(function (err, categories) {
        if (err) return next(err);
        res.json(categories);
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.get('/:id', function(req, res, next) {
  var token = getToken(req.headers);
  if (req.headers) {
    Category.findById(req.params.id, function (err, category) {
      if (err) return next(err);
      res.json(category);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/',passport.authenticate('jwt', { session: false}),function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    Category.create(req.body, function (err, category) {
      if (err) return next(err);
      res.json(category);
    });
  } else {
    return res.status(403).send("You are not allowed");
  
  }
});

router.put('/:id',  function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    Category.findByIdAndUpdate(req.params.id, req.body, function (err, category) {
      if (err) return next(err);
      res.json(category);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.delete('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    Category.findByIdAndRemove(req.params.id, req.body, function (err, category) {
      if (err) return next(err);
      res.json(category);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;