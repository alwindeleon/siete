var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function(req,res,next){
  //res.send(queues.queues);
  res.render('index',{queues:queues.queues});
});

router.get('/classes', function(req,res,next){
  var classList = {"CS 11 THU": 5,"CS 12 WFX":4, "CS 153 THX":4, "CS 32 THR":10}; //key-value pair of class section and available slots
  var updateTime = new Date();
  res.render('classes',{classList: classList, updateTime: updateTime});
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