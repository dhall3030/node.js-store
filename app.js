const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//added
const expressHbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose'); 
const session = require('express-session');
const MongoStore= require('connect-mongo')(session);
const passport = require('passport'); 
const flash = require('connect-flash');
const validator = require('express-validator'); 
//end added

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const productRouter = require('./routes/product');

const app = express();

//passport config
require('./config/passport');


//map global promise - get rid of warning 

mongoose.Promise = global.Promise;


//Connect to mongoose 
mongoose.connect('mongodb://localhost/nodestore', {

	//useMongoClient: true
	useNewUrlParser: true

})
.then(() => console.log('MongoDB Connected...'))
.catch(err =>console.log(err));


// view engine setup

//hbs helpers

const {formatDate} = require('./helpers/hbs');

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs' , helpers:{formatDate: formatDate}}));
app.set('view engine', '.hbs');


// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


//upload folder
app.use('/uploads',express.static('uploads'));

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

//Method override middleware 
app.use(methodOverride('_method'));

app.use(function(req, res, next) {


	res.locals.login = req.isAuthenticated();
  	res.locals.session = req.session;
  	res.locals.successMsg = req.flash('success');
  	res.locals.errorMsg = req.flash('error');
  	//res.locals.errors = req.flash('errors');
	return next();

});

app.use('/', indexRouter);
app.use('/user', usersRouter);
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
