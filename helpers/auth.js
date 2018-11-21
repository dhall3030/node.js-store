module.exports = {

	ensureAuthenticated: function(req, res, next){

		if(req.isAuthenticated()){

			return next();

		}
		req.session.oldUrl = req.url;
		req.flash('error', 'Not Authorized'); 
		res.redirect('/user/signin');


	},

	notAuthenticated: function(req, res ,next){


		if(!req.isAuthenticated()) {

    		return next();

  		}
  		
  		res.redirect('/');



	}


}