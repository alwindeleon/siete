var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  scraperjs = require('scraperjs');

//  returns a promise. usage  -> getCSCLASSES().then(fn(data))
// eg. getCSCLASSES().then(function(info){
//      console.log(info)
//     });
// data -> {CS_CLASESS: [name1,name2...], AVAILABILITY: [[availableslots1, totalslots1]...[]]

var CS_CLASSES=[];
var AVAILABILTY=[];
function getCSCLASSES(){
  return scraperjs.StaticScraper.create('https://crs.upd.edu.ph/schedule/120152/cs')
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

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function(req,res,next){
  //res.send(queues.queues);
  res.render('index',{queues:queues.queues});
});

router.get('/classes', function(req,res,next){
  var classList = {}; //key-value pair of class section and available slots
  getCSCLASSES().then(function(info){
    console.log(info)
    for(var i = 0; i < info.CS_CLASSES.length; i++){
      classList[info.CS_CLASSES[i]] = info.AVAILABILTY[i][0]
    }
    var updateTime = new Date();
    return res.render('classes',{classList: classList, updateTime: updateTime});
  })
  
  
});

/*router.get('/', function (req, res, next) {
  //declare a funtion
  function isEmptyObject( obj ) {
      for ( var name in obj ) {
          return false;
      }
      return true;
  }
  //show homepage
  var qAdvise = queues.advise;
  //console.log("log:  " + qAdvise);
// <<<<<<< HEAD
//   res.render('index', {queuesAdvise: qAdvise, queuesEnlist: queues.enlisters});
// =======
  qEnlist = {};
  if(!isEmptyObject(queues.enlisters)){
    for(var i = 0; i < queues.enlisters.length; i++){
      qEnlist[queues.enlisters[i][0]] = queues.enlisters[i][2];
    }
  }
  

  res.render('index', {queuesAdvise: qAdvise, queuesEnlist: qEnlist});
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
    if(!req.body.username || !req.body.password)
    return res.render('login',
      {error: 'Please enter your email and password'
    });
  User.findOne({
    username: req.body.username,
    password: req.body.password
  }, function(error, user){
    console.log(user);
    if(error) return next(error);
    if(!user) return res.render('login',{error: 'Incorrect email and password '});
    console.log("users role is"+user.role);
    req.session.role =  user.role;
    res.redirect('/'+user.role);
  })

});

router.get('/logout', function (req, res, next) {
  if(req.session) req.session.destroy();
  res.redirect('/');
});*/