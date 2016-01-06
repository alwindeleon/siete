var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/enlister', router);
};

router.get('/', function (req, res, next) {
  // show enlister page
});
