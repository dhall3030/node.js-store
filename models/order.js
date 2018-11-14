var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var schema = new Schema({ 

	_id: mongoose.Schema.Types.ObjectId, 
	user: {type: Schema.Types.ObjectId, ref: 'User' },
	cart: {type: Object, required: true}, 
	name: {type: String, required: true},
	paymentId: {type: String, required: true},


});


module.exports = mongoose.model('Order',schema);