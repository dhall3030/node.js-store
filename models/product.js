var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var schema = new Schema({ 

	_id: mongoose.Schema.Types.ObjectId, 
	imagePath: {type: String, required: false}, 
	title: {type: String, required: true}, 
	description: {type: String, required: true},
	price: {type: Number, required: true},

});


module.exports = mongoose.model('Product',schema);