var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
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
});