var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  //show homepage
  var qAdvise = queues.advise;
  //console.log("log:  " + qAdvise);
<<<<<<< HEAD
  res.render('index', {queuesAdvise: qAdvise, queuesEnlist: queues.enlisters});
=======
  qEnlist = {"CS": "blue"};

  res.render('index', {queuesAdvise: qAdvise, queuesEnlist: qEnlist});
>>>>>>> 8144a275b4bff34fcfe63c18715fab0490587f62
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

router.post('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});