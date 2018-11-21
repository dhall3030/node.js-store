var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');

const {ensureAuthenticated,notAuthenticated} = require('../helpers/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The home page' });
});


router.get('/shop', function(req, res, next) {
  
  	Product.find()
   .exec()
   .then(products=>{


   		const productChunks = [];
  		const chunkSize = 3; 

	  	for(var i = 0; i < products.length; i += chunkSize){

	  		productChunks.push(products.slice(i, i + chunkSize));

	  	}


   		res.render('shop/index', { title: 'Shopping Page', products: productChunks});


   })
   .catch(err =>{


	console.log(err);


	});


  	

  
  
  
});



router.get('/add-to-cart/:id', function(req, res, next) {


	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {} );

	Product.findById(productId, function(err, product){

		if(err){


			return res.redirect('/shop');


		}

		cart.add(product, product.id);

		req.session.cart = cart; 

		console.log(req.session.cart);

		res.redirect('/shop');


	});
});


router.get('/add-to-cart/:id', function(req, res, next) {


	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {} );

	Product.findById(productId, function(err, product){

		if(err){


			return res.redirect('/shop');


		}

		cart.add(product, product.id);

		req.session.cart = cart; 

		console.log(req.session.cart);

		res.redirect('/shop');


	});
});




router.get('/cart', function(req, res, next){
	if(!req.session.cart){

		return res.render('shop/cart', {products: null});

	}

	let cart = new Cart(req.session.cart);
	res.render('shop/cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});


});





router.get('/increase/:id', function(req, res, next) {


	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {} );

	Product.findById(productId, function(err, product){

		if(err){


			return res.redirect('/cart');


		}

		cart.add(product, product.id);

		req.session.cart = cart; 

		console.log(req.session.cart);

		res.redirect('/cart');


	});
});





router.get('/reduce/:id',function(req, res, next){

	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {} );
	cart.reduceByOne(productId);
	
	req.session.cart = cart; 
	res.redirect('/cart'); 



});




router.get('/remove/:id',function(req, res, next){

	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {} );
	cart.removeItem(productId); 
	req.session.cart = cart; 
	res.redirect('/cart'); 



});


router.get('/checkout' , ensureAuthenticated , function(req, res, next){


	res.render('shop/checkout');


	
});



router.post('/checkout' , ensureAuthenticated , function(req, res, next){






});



module.exports = router;
