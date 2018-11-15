var express = require('express');
var router = express.Router();

var csrf = require('csurf'); 
var passport = require('passport');


var csrfProtection = csrf();

router.use(csrfProtection);



router.get('/profile', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('user/profile');

});


router.get('/signup',  function(req, res, next) {

  res.render('user/signup', {csrfToken: req.csrfToken()});

});


router.post('/signup', passport.authenticate('local.signup', {

  //successRedirect: '/user/profile', 
  failureRedirect: '/user/signup', 
  badRequestMessage : 'Please fill the form',
  failureFlash: true


}),function(req, res, next){


    if(req.session.oldUrl){

        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl); 
        
    }else{

      res.redirect('/user/profile');

    }




});


router.get('/signin',  function(req, res, next) {

  res.render('user/signin', {csrfToken: req.csrfToken() });

});



router.post('/signin', passport.authenticate('local.signin', {

  successRedirect: '/user/profile', 
  failureRedirect: '/user/signin', 
  badRequestMessage : 'Please fill the form',
  failureFlash: true

}),function(req, res, next){


    if(req.session.oldUrl){

        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl); 

    }else{

      res.redirect('/user/profile');

    }




});


router.get('/logout', function(req, res, next){

  req.logout();

  res.redirect('/');


});


module.exports = router;
