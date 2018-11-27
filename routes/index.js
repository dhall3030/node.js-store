var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var mongoose = require('mongoose'); 
var Product = require('../models/product');
var Order = require('../models/order');

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

	if(!req.session.cart){

		return res.redirect('/cart');
		
	}

	let cart = new Cart(req.session.cart);

	res.render('shop/checkout',{total: cart.totalPrice});


	
});



router.post('/checkout' , ensureAuthenticated , function(req, res, next){


	if(!req.session.cart){

		return res.redirect('/cart');

	}
	
	let cart = new Cart(req.session.cart);

	var stripe = require("stripe")("sk_test_QCuNsqlTbDnR0xpgZIq2q1Rd"); 

	stripe.charges.create({

		amount: cart.totalPrice * 100 , 
		currency: "cad",
		source: req.body.stripeToken,
		description: "Test Charge" 



	},function(err, charge){

		if(err){

			req.flash('error', err.message);
			return res.redirect('/checkout');

		}

		var order =new Order({
			_id: new mongoose.Types.ObjectId(),
			user: req.user,
			cart: cart, 
			address: req.body.address, 
			name: req.body.name,
			paymentId: charge.id


		});

		console.log(order);

		order.save(function(err, result) {

			if(err){

				console.log(err);

			}


			req.flash('success', 'Successfully bought product!');
			req.session.cart = null;
			res.redirect('/');


		});

		

	});



});



module.exports = router;
