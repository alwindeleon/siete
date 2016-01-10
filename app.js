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
        this.enlist = {};
        
      //availability of classes
        this.enlistAvailable = {};


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
      if(this.advise[queueName].length <= 5) return 0;
      var advisees = new Array();
      for(var i = 0; i < numOfRequest; ii++){
        advisees.push(this.advise[queueName].shift());
      }
      return this.advise[queueName];
    },

    enlistEnqueue: function(info, subjects) {
      for(var i in subjects){
        this.enlist[subjects[i]].push(info);
      }
    },
    enlistDequeue: function(queueName) {
        return this.enlist[queueName].shift();
    },

    adviseCreateQ: function(queueName) {
      this.advise[queueName] = [];
      this.adviseControlNumber[queueName] = 1;
    },

    enlistInitQ: function() {
      var self = this;
      var CS_CLASSES=[];
      var AVAILABILTY=[];
      scraperjs.StaticScraper.create('https://crs.upd.edu.ph/schedule/120152/cs')
        .scrape(function($) {
            
            $('#tbl_schedule tbody tr td:nth-child(2)').each( function(){
               CS_CLASSES.push( $(this).text() );       
            }).get();

            $('#tbl_schedule tbody tr td:nth-child(2)').each( function(){
               AVAILABILTY.push( $(this).text() );       
            }).get();

            return {
              CS_CLASSES: CS_CLASSES,
              AVAILABILTY: AVAILABILTY
            }
        })
        .then(function(scrapedInfo) {
          //remove whitespaces in AVAILABILTY
          scrapedInfo.AVAILABILTY = scrapedInfo.AVAILABILTY.map(function(x){
              return x.split('/').map(function(z){
                console.log(z.trim());
                return z.trim();
              });
            });
            scrapedInfo.CS_CLASSES.forEach(function(csClass,index){
              self.enlist[csClass] = [];
              self.enlistAvailable[csClass] = scrapedInfo.AVAILABILTY[index];
            });
        })

    },

    updateEnlistAvailable: function(){
      var self = this;

      scraperjs.StaticScraper.create('https://crs.upd.edu.ph/schedule/120152/cs')
        .scrape(function($) {
            var CS_CLASSES=[];
            var AVAILABILTY=[];
            $('#tbl_schedule tbody tr td:nth-child(2)').each( function(){
               CS_CLASSES.push( $(this).text() );       
            }).get();

            $('#tbl_schedule tbody tr td:nth-child(2)').each( function(){
               AVAILABILTY.push( $(this).text() );       
            }).get();

            return {
              CS_CLASSES: CS_CLASSES,
              AVAILABILTY: AVAILABILTY
            };
        })
        .then(function(scrapedInfo) {
          //remove whitespaces in AVAILABILTY
          scrapedInfo.AVAILABILTY = scrapedInfo.AVAILABILTY.map(function(x){
              return x.split('/').map(function(z){
                console.log(z.trim());
                return z.trim();
              });
            });
          scrapedInfo.CS_CLASSES.forEach(function(csClass,index){
            self.enlistAvailable[csClass] = scrapedInfo.AVAILABILTY[index];
          });
        })
        
    },
    adviseGetQueue: function(queueName){
      return this.advise[queueName];
    },
    resetQueues: function(){
      this.advise = {};
      this.adviseControlNumber = {};
      this.enlist = {};
      this.enlistAvailable = {};
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