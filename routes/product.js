var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'); 
var Product = require('../models/product');


/* GET users listing. */
router.get('/', function(req, res, next) {
   
   Product.find()
   .exec()
   .then(products=>{


   		res.render('product/index', { title: 'Manage Products', products: products});


   })
   .catch(err =>{


	console.log(err);


	});
   
   
});





// Add Product Form 
router.get('/create',(req , res ,next) => {

	res.render('product/create');

});

// Process create product
router.post('/create',(req , res ,next) => {

	
	//validation 
	req.checkBody('title', 'title required').notEmpty();
    req.checkBody('description', 'description required').notEmpty();
    req.checkBody('price', 'price required').notEmpty();
    

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
           messages.push(error.msg);
        });
         
        req.flash('error', messages);

        res.redirect('/product/create');
    }




	const newProduct = {

		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		description: req.body.description,
		price: req.body.price


	}

	new Product(newProduct)
	.save()
	.then(product=>{

		console.log(product);

		req.flash('success', 'Product created successfully!');

		res.redirect('/product');



	})
	.catch(err =>{

		console.log(err);


	});



});


module.exports = router;