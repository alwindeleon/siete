var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/adviser', router);
};

router.get('/login', function (req, res, next) {
  // show adviser page
});
