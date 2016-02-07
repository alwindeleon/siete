var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  http = require('http'),
  scraperjs = require('scraperjs'),
  socketIo = require('socket.io'),
  socketMVC = require('socket.mvc'),
  Class = require('classes').Class;



Class('MainQueues', {
    
    construct: function() {
      //dictionary of queues for advising
        this.advise = {};
      // advise control number
        this.adviseControlNumber ={};

      // dictionary of queues for enlistment
        this.enlistees = [];
        
      //availability of classes
        this.enlisters = {};

      //cs subjects
      this.CS_subjects = [ 11, 12, 21, 30, 32, 130, 131, 133, 135, 140, 145, 150, 153, 180, 192, 194, 196, 197, 199, 210, 220, 231, 250, 253, 282, 290, 294, 295, 296, 297, 298, 300, 400];


    },
    
    adviseEnqueue: function(info, queueName) {
        var curCN = this.adviseControlNumber[queueName];
        info = String(curCN) + '. ' + info;
        this.advise[queueName].push(info);
        this.adviseControlNumber[queueName]++;
        return curCN;
    },
    adviseDequeue: function(queueName, numOfRequest) {
      if(!numOfRequest) numOfRequest = 5;
      if(this.advise[queueName].length <= 5){
        this.advise[queueName] = [];
        return 0;
      }
      var advisees = new Array();
      for(var i = 0; i < numOfRequest; ii++){
        advisees.push(this.advise[queueName].shift());
      }
      return this.advise[queueName];
    },

    enlisteeEnqueue: function(info, subjects) {
     var element = [info,subjects.split(',')];
     this.enlistees.push(element);

    },
    enlisteeDequeue: function(name, subject) {
        for( var i = 0; i < this.enlistees.length; i++){
          if(name == this.enlistees[i][0]){
            var ind = this.enlistees[i][1].indexOf(subject);
            if(ind > -1){
              this.enlistees[i][1].splice(ind,1);
            }
            if(this.enlistees[i][1].length == 0){
              this.enlistees.splice(i,1);
            }
            break;
          }
        }
    },
    enlisterEnqueue: function(name, subject) {
     for(var key in this.enlisters){
      var enlistersSubjs = Object.keys(this.enlisters[key])[0].split(',');
      if( enlistersSubjs.indexOf(subject) > 0 && this.enlisters[key].indexOf(name) < 0){
        this.enlisters[key].push(name);
      }
     }

    },
    enlisterDequeue: function(name){
      if(this.enlisters[name].length <=5){
        var count = this.enlisters[name].length;
        for(var i = 0; i < count; i++){
          var subjects = name.split(',');
          var curEnlistee = this.enlisters[name].shift();
          for(var j = 0; j < subjects.length; j++){
            this.enlisteeDequeue(curEnlistee,subjects[j] );
          }
        }
      }
      else{
        for(var i = 0; i < 5; i++){
          var subjects = name.split(',');
          var curEnlistee = this.enlisters[name].shift();
          for(var j = 0; j < subjects.length; j++){
            this.enlisteeDequeue(curEnlistee,subjects[j] );
          }
        }
      }
      
    },

    adviseCreateQ: function(queueName) {
      this.advise[queueName] = [];
      this.adviseControlNumber[queueName] = 1;
    },

    createEnlister: function(subjects) {
      console.log('INNNNNNNNNNNNNNN');
      this.enlisters[subjects] = [];
      console.log(subjects);
      subjectsArr = subjects.split(',');
      for(var i = 0 ; i < subjectsArr.length; i++){
        for( var j = 0; j < this.enlistees.length; j++){
          if(this.enlistees[j][1].indexOf(subjectsArr[i]) > -1 && this.enlisters[subjects].indexOf(this.enlistees[j][0]) < 0){
            this.enlisters[subjects].push(this.enlistees[j][0]);
          }
        }
      }
      console.log(this.enlisters[subjects]);
      return this.enlisters[subjects];
    },

    updateEnlistAvailable: function(){
      
        
    },
    adviseGetQueue: function(queueName){
      return this.advise[queueName];
    },
    resetQueues: function(){
      this.advise = {};
      this.adviseControlNumber = {};
      this.enlistees = {};
      this.enlisters = {};
    }

});

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

db.once('open', function() {
  console.log("connected to " +  config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

queues = new MainQueues();

require('./config/express')(app, config);

var server = http.Server(app);
var io = socketIo(server);

server.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});


// io.sockets.on('connection', function (socket) {
//   console.log("LONG POLLING FAK");
//  socketMVC.init(socketIo, socket, {
//     debug: true,
//     filePath: ['./app/controllers/index-socket.js']
//   });
// });

io.sockets.on('connection', function(socket){
  socket.emit('connection');
  console.log('someone connected');
  socketMVC.init(socketIo, socket, {
    debug: true,
    filePath: ['./app/controllers/index-socket.js']
  });
});

// for testing  -louvette
queues.adviseCreateQ("2012");
queues.adviseEnqueue("oh wonder", "2012");
queues.adviseEnqueue("fickle friends", "2012");


queues.adviseCreateQ("2011");
queues.adviseEnqueue("john mayer", "2011");
queues.adviseEnqueue("john may", "2011");
queues.adviseEnqueue("john mayest", "2011");