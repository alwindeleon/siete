var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/regteamadmin', router);
};

router.get('/', function (req, res, next) {
  // show regteam admin page
});
