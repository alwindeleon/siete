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
      this.queues = [];
      this.classList = [];
      this.classAvailablity = [];
    },

    // newQ input structure: {'CS11': {'Content':[{'Number':1, 'Name': 'John'}], 'Queue Number': 1}}
    add: function(newQ){
      this.queues.push(newQ);
    },

    add_to_queue: function(qname, name) {
      var q = this.get_queue(qname);

      q['Queue Number'] += 1;
      var last_num = q['Queue Number'];
      q['Content'].push({'Name': name, 'Number': last_num});

      console.log("add\n");

      return last_num;

    },

    get_queue: function(qname){
      var q = null; //get queue
      for(var i=0; i < this.queues.length; i++){
        if(Object.keys(this.queues[i])[0] == qname)
          q = this.queues[i][qname]
      }

      return q;      
    },

    get_all_queues: function(){
      return this.queues;      
    },

    get_all_queue_names: function(){
      var qnames = []
      for(var i of this.queues){
        qnames.push(Object.keys(i)[0])
      }
      return qnames;      
    },

    
    dequeue: function(qname, number){
      if(!number) number = 5;

      var q = this.get_queue(qname);
      var callNext = [];
      var qContents = q['Content'];

      for(var i=0; i < number; i++){
        if(qContents.length > 0)
          callNext.push(qContents.shift());
        else
          break;
      }
      return callNext;//array of next people to call in line
    },

    enlistInitQ: function() {
      
    },    
});

var CS_CLASSES=[];
var AVAILABILTY=[];

//  returns a promise. usage  -> getCSCLASSES().then(fn(data))
// eg. getCSCLASSES().then(function(info){
//      console.log(info)
//     });
// data -> {CS_CLASESS: [name1,name2...], AVAILABILITY: [[availableslots1, totalslots1]...[]]
function getCSCLASSES(){
  var self = this;
  return scraperjs.StaticScraper.create('https://crs.upd.edu.ph/schedule/120154/cs')
    .scrape(function($) {
        
        $('#tbl_schedule tbody tr td:nth-child(2)').each( function(){
           CS_CLASSES.push( $(this).text() );       
        }).get();

        $('#tbl_schedule tbody tr td:nth-child(6)').each( function(){
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
            return z.trim();
          });
        });
        CS_CLASSES = scrapedInfo.CS_CLASSES
        AVAILABILTY = scrapedInfo.AV
         return scrapedInfo
    })
};
//mongoose.connect(config.db);
//var db = mongoose.connection;
//db.on('error', function () {
//  throw new Error('unable to connect to database at ' + config.db);
//});//

//db.once('open', function() {
//  console.log("connected to " +  config.db);
//});//

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});


var app = express();

queues = new MainQueues();
//a Queue is a {Queue name, dict}
//a dict is {Content_list, Last Number}
//a Content is a list of {Name, number}
queues.add({'CS11': {'Content':[{'Number':1, 'Name': 'John'}], 'Queue Number': 1}});
queues.add({'CS123': {'Content':[{'Number':1, 'Name': 'Jake'}], 'Queue Number': 1}});
queues.add({'CS145': {'Content':[{'Number':1, 'Name': 'Jake'}], 'Queue Number': 1}});
queues.add({'CS187': {'Content':[{'Number':1, 'Name': 'Jake'}], 'Queue Number': 1}});
queues.add({'2014': {'Content':[{'Number':1, 'Name': 'Jake'}], 'Queue Number': 1}});
queues.add({'2013': {'Content':[{'Number':1, 'Name': 'Jake'}], 'Queue Number': 1}});
queues.add({'CS10': {'Content':[{'Number':1, 'Name': 'Jake'}], 'Queue Number': 1}});
queues.add({'CS200': {'Content':[{'Number':1, 'Name': 'Jake'}], 'Queue Number': 1}});
queues.add({'CS300': {'Content':[{'Number':1, 'Name': 'Jake'}], 'Queue Number': 1}});

queues.add_to_queue('CS11', "Jake");


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
