const express = require('express');
const router = express.Router();

const mongoose = require('mongoose'); 
const Product = require('../models/product');

//const user = require('../helpers/connect-roles.js');




const multer = require('multer');

const fs = require('fs');

const csrf = require('csurf');

const csrfProtection = csrf();

//router.use(csrfProtection);



//config multer
const storage = multer.diskStorage({

	destination: function(req, file, cb) {

		cb(null, './uploads/'); 

	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
		//cb(null, new Date().toISOString() + file.originalname);
		//cb(null, Date.now() + file.originalname); 

	}
});


const fileFilter = (req, file,cb) => {

	//reject a file
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){

		cb(null, true); 

	}else{

		cb(null, false);

	}

};


const upload = multer({ 

	storage: storage , 
	limits:{

		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter


});










router.get('/page/:page', function(req, res, next) {
   console.log('hello'+req.user.role);
   let pageNumber = Math.max(0, req.params.page)
   let size = 10

   let query={}


   Product.find(query)
   .sort({date: 'desc'})
   .skip(size * (pageNumber -1))
   .limit(size)
   .exec()
   .then(products=>{

   		Product.count(query).exec(function(err, count) {
   		
   			let pageCount = Math.ceil(count / size)



   			res.render('product/index', { 

   				title: 'Manage Products', 
   				products: products,
   				pages: pageCount,
   				path: '/product/page/',
				pagination: { page: pageNumber, pageCount: pageCount}

   			});

   		});

   })
   .catch(err =>{


	console.log(err);


	});
   
   
});





// Add Product Form 
router.get('/create',(req , res ,next) => {

	//res.render('product/create',{csrfToken: req.csrfToken()});
	res.render('product/create');

});

// Process create product
router.post('/create', upload.single('productImage'),(req , res ,next) => {

	
	//validation 
	req.checkBody('title', 'title required').notEmpty();
    req.checkBody('description', 'description required').notEmpty();
    req.checkBody('price', 'price required').notEmpty();
    //req.checkBody('password2', 'Password do not match').equals(req.body.password);
    

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
           messages.push(error.msg);
        });
         
        req.flash('error', messages);

        res.redirect('/product/create');
    }


    console.log(req.file);

	const newProduct = {

		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		description: req.body.description,
		price: req.body.price,
		imagePath: req.file.path


	}

	new Product(newProduct)
	.save()
	.then(product=>{

		console.log(product);

		req.flash('success', 'Product created successfully!');

		res.redirect('/product/page/1');



	})
	.catch(err =>{

		console.log(err);


	});



});


// Edit Product Form 
router.get('/edit/:id',(req , res ,next) => {

	Product.findOne({

		_id: req.params.id

	})
	.exec()
	.then(product =>{

	
		//res.render('product/edit',{csrfToken: req.csrfToken(), product: product});
		res.render('product/edit',{product: product});

	}).catch(err =>{


		console.log(err);


	});




	

});


// Process edit product
router.put('/:id',upload.single('productImage'),(req , res ,next) => {

	
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

        res.redirect('/product/edit/'+req.params.id);
    }



    Product.findOne({

		_id: req.params.id

	})
	.exec()
	.then(product=>{

		product.title= req.body.title;
		product.description= req.body.description;
		product.price= req.body.price;

		if(req.file){

			if(product.imagePath){

				fs.unlink(product.imagePath, function() {
			      console.log("image deleted")
	    		});

			}

			


			product.imagePath = req.file.path;

		}
		

		product.save()
		.then(product=>{

			req.flash('success', 'Product updated successfully!');

			res.redirect('/product');


		})
		.catch(err =>{

		console.log(err);


		});
		



	})
	.catch(err =>{

		console.log(err);


	});



});

router.get('/delete/:id',(req , res ,next) => {
		 Product.remove({_id: req.params.id})
		.exec()
		.then(()=>{

			req.flash('success','Product removed');

			res.redirect('/product');


		})
		.catch(err =>{


		console.log(err);


		});
});

module.exports = router;
