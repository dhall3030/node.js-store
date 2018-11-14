var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'); 
var Product = require('../models/product');
var Order = require('../models/order');

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'The shop page' });
});

module.exports = router;