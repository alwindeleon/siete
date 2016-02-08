var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/regteam', router);
};

router.get('/', function (req, res, next) {
  //show regteam page
  if(queues.advise != null){
    var  adviseQs = Object.keys(queues.advise);
  }
  else {
     var  adviseQs = [];
  }
  
  res.render('regteam', {adviseList:adviseQs , enlistList:queues.CS_subjects });
});



