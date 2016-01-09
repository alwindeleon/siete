var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  scraperjs = require('scraperjs'),
  Class = require('classes').Class;

Class('MainQueues', {
    
    construct: function() {
      //dictionary of queues for advising
        this.advise = {};

      // dictionary of queues for enlistment
        this.enlist = {};
        
      //availability of classes
        this.enlistAvailable = {};
    },
    
    adviseEnqueue: function(info, queueName) {
        this.advise[queueName].push(info);
    },
    adviseDequeue: function(info, queueName, numOfRequest) {
      if(!numOfRequest) numOfRequest = 5;
        var advisees = new Array();
        for(var i = 0; i < numOfRequest; ii++){
          advisees.push(this.advise[queueName].shift());
        }
        return advisees;
    },

    enlistEnqueue: function(info, subjects) {
      for(var i in subjects){
        this.enlist[subjects[i]].push(info);
      }
    },
    enlistDequeue: function(info, queueName) {
        return this.enlist[queueName].shift();
    },

    adviseCreateQ: function(queueName) {
      this.advise[queueName] = [];
    },

    enlistInitQ: function() {
      var self = this;
      var CS_CLASSES=[];
      var AVAILABILTY=[];
      scraperjs.StaticScraper.create('https://google.com')
      // scraperjs.StaticScraper.create('https://crs.upd.edu.ph/schedule/120152/cs')
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

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
