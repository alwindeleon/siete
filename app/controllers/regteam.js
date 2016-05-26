var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/regteam', router);
};

router.get('/', function (req, res, next) {
  //show regteam page
  //queue data structure to be finalized
  if(queues.queues != null){
    var q = queues.queues;
    var queueList = [];
    for(var i=0; i < q.length; i++){
      queueList.push(Object.keys(q[i]));
    }
  }
  else {
     var queueList=[];
  }
  
  res.render('regteam', { queueList:queueList });
});



