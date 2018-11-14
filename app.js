var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//added
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose'); 
var session = require('express-session');
var MongoStore= require('connect-mongo')(session);
var passport = require('passport'); 
var flash = require('connect-flash');
var validator = require('express-validator'); 
//end added

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var shopRouter = require('./routes/shop');
var productRouter = require('./routes/product');

var app = express();

//passport config
require('./config/passport');


//Connect to mongoose 
mongoose.connect('mongodb://localhost/nodestore', {

	//useMongoClient: true
	useNewUrlParser: true

})
.then(() => console.log('MongoDB Connected...'))
.catch(err =>console.log(err));


// view engine setup

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');


// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(validator());

app.use(cookieParser());
app.use(session({
  secret: 'secret', 
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie:{ maxAge: 100 * 60 * 1000 }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {


	res.locals.login = req.isAuthenticated();
  	res.locals.session = req.session;
  	res.locals.successMsg = req.flash('success');
  	res.locals.errorMsg = req.flash('error');
	return next();

});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/shop', shopRouter);
app.use('/product', productRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
