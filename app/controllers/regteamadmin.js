var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/regteamadmin', router);
};

router.get('/', function (req, res, next) {
  // show regteam admin page
  res.render('regteamadmin');
});

router.post('/createqueue', function(req,res, next){
  queues.adviseCreateQ(req.body.queueName);
  res.render('regteamadmin',{message: 'queue created'});
});
