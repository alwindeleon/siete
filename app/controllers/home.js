var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  //show homepage
  res.render('login');
});

router.get('/login', function (req, res, next) {
  
});

router.get('/logout', function (req, res, next) {
  
});