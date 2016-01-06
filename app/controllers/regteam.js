var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/regteam', router);
};

router.get('/', function (req, res, next) {
  //show regteam page
});

router.get('/enlister', function (req, res, next) {
  
});


