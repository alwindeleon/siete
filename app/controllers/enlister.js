var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/enlister', router);
};

router.get('/', function (req, res, next) {
  // show enlister page
  res.send("welcome enlister");
});

router.get('/dequeue',function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  
  var queueName = req.body.queueName;
  var advisees = queues.enlistDequeue(info, queueName, 5);
  var updatedQueue = queues.enlistGetQueue(queueName);
  var dataToReturn = {
    advisees : advisees,
    queues: updatedQueue
  };
  res.send(JSON.stringify(dataToReturn));
});

router.get('/queue',function(req,res, next){
  res.setHeader('Content-Type', 'application/json');

  var queueName = req.body.queueName;
  var queue = queues.enlistGetQueue(queueName);
  var dataToReturn = {
    queue: queue
  }
  res.send(JSON.stringify(dataToReturn));
});

