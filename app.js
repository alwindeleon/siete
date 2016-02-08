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

        this.enlistees = [];
        
        this.enlisters = [];

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
      for(var i = 0; i < numOfRequest; i++){
        advisees.push(this.advise[queueName].shift());
      }
      return this.advise[queueName];
    },

     enlisteeEnqueue: function(name, subjects) {
       console.log("inside  enqueueEnlistee")
       var element = [name,subjects];
       this.enlistees.push(element);
    },
    enlisteeDequeue: function(name,subjectsOfProf) {
      console.log("inside   dequeueEnlistee")
      console.log(subjectsOfProf)
      var curStudentsToGoUp = [];
      // get index of prof
      var indexOfProf;
      for( var i = 0; i < this.enlisters.length; i++){
        if(this.enlisters[i][0] == name){
          indexOfProf = i;
          break;
        }
      }
      for(var i = 0; i < this.enlistees.length; i++){
        if(curStudentsToGoUp.length == 5) {
          this.enlisters[indexOfProf][2] = curStudentsToGoUp;
          return curStudentsToGoUp;
        }
        for(var j = 0; j < subjectsOfProf.length; j++ ){
          console.log(this.enlistees[i][1] +  " vs " +subjectsOfProf[j])
          if(this.enlistees[i][1].indexOf(subjectsOfProf[j]) > -1){
            // remove subject tagged in student
            this.enlistees[i][1].splice(j,1);
            //push to current students that should be in the room upstairs 
            console.log("enlisteeDequeue err1")
            if(curStudentsToGoUp.indexOf(this.enlistees[i][0]) <= -1) curStudentsToGoUp.push(this.enlistees[i][0]);
            console.log("enlisteeDequeue err2")
            //check if tagged subjects length is equal to zero
            if(this.enlistees[i][1].length == 0){
              this.enlistees.splice([i],1);
            }
          }
        }
      }

      console.log("enlisteeDequeue DONE!")
      console.log("returning " + curStudentsToGoUp)
      this.enlisters[indexOfProf][2] = curStudentsToGoUp;
      return curStudentsToGoUp;
    },

    adviseCreateQ: function(queueName) {
      this.advise[queueName] = [];
      this.adviseControlNumber[queueName] = 1;
    },

    createEnlister: function(name,subjects) {
      var element = [name,subjects,[]];
      console.log("CREATED ENLISTER " + name+" in these subjects" + subjects);
      this.enlisters.push(element);
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
queues.adviseEnqueue("apple", "2011");
queues.adviseEnqueue("orange", "2011");
queues.adviseEnqueue("beef", "2011");
queues.adviseEnqueue("apple", "2011");
queues.adviseEnqueue("orange", "2011");
queues.adviseEnqueue("beef", "2011");
queues.adviseEnqueue("apple", "2011");
queues.adviseEnqueue("orange", "2011");
queues.adviseEnqueue("beef", "2011");
queues.adviseEnqueue("apple", "2011");
queues.adviseEnqueue("orange", "2011");
queues.adviseEnqueue("beef", "2011");
queues.adviseEnqueue("orange", "2011");
queues.adviseEnqueue("beef", "2011");
queues.adviseEnqueue("apple", "2011");
queues.adviseEnqueue("orange", "2011");
queues.adviseEnqueue("beef", "2011");
