const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 


const schema = new Schema({ 

	_id: mongoose.Schema.Types.ObjectId, 
	user: {type: Schema.Types.ObjectId, ref: 'User' },
	cart: {type: Object, required: true}, 
	name: {type: String, required: true},
	paymentId: {type: String, required: true},
	date:{ type: Date, default: Date.now}


});


module.exports = mongoose.model('Order',schema);