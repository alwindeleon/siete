var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/adviser', router);
};

router.get('/', function (req, res, next) {
  // show adviser page
  res.render('adviser');
});

router.get('/dequeue',function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  
  var queueName = req.body.queueName;
  var advisees = queues.adviseDequeue(info, queueName, 5);
  var updatedQueue = queues.adviseGetQueue(queueName);
  var dataToReturn = {
    advisees : advisees,
    queues: updatedQueue
  };
  res.send(JSON.stringify(dataToReturn));
});

router.get('/queue',function(req,res, next){
  res.setHeader('Content-Type', 'application/json');

  var queueName = req.body.queueName;
  var queue = queues.adviseGetQueue(queueName);
  var dataToReturn = {
    queue: queue
  }
  res.send(JSON.stringify(dataToReturn));
});



