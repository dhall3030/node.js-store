var express = require('express');
var router = express.Router();

var Order = require('../models/order');
const Cart = require('../models/cart');

var csrf = require('csurf'); 
var passport = require('passport');

const {ensureAuthenticated,notAuthenticated} = require('../helpers/auth');

var csrfProtection = csrf();

router.use(csrfProtection);



router.get('/profile',ensureAuthenticated, function(req, res, next) {
  
  Order.find({user: req.user})
   .exec()
   .then(orders=>{ 

      let cart; 

      orders.forEach(function(order) {

      cart = new Cart(order.cart);
      order.items = cart.generateArray(); 

      });

      res.render('user/profile' ,{orders: orders});


   })
   .catch(err =>{


      console.log(err); 

     


     


   });





  //res.send('respond with a resource');
 

});


router.get('/signup',notAuthenticated, function(req, res, next) {

  res.render('user/signup', {csrfToken: req.csrfToken()});

});


router.post('/signup',notAuthenticated, passport.authenticate('local.signup', {

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


router.get('/signin',notAuthenticated,  function(req, res, next) {

  res.render('user/signin', {csrfToken: req.csrfToken() });

});



router.post('/signin',notAuthenticated, passport.authenticate('local.signin', {

  //successRedirect: '/user/profile', 
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


router.get('/logout',ensureAuthenticated, function(req, res, next){

  req.logout();

  res.redirect('/user/signin');


});


module.exports = router;
