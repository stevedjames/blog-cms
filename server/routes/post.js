var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
var Post = require("../models/Post");

router.get('/', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        Post.find(function (err, posts) {
        if (err) return next(err);
        res.json(posts);
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.get('/:id',  function(req, res, next) {
  var token = getToken(req.headers);
  if (req.headers) {
    Post.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/',function(req, res, next) {
  var token = getToken(req.headers);
  if (req.headers) {
    Post.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.put('/:id', function(req, res, next) {
  var token = getToken(req.headers);
  if (req.headers) {
    Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.delete('/:id', function(req, res, next) {
  var token = getToken(req.headers);
  if (req.headers) {
    Post.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
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