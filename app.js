var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var cors = require('cors');
dotenv.config();

var homeRouter = require('./routes/home-route');
var usersRouter = require('./routes/user-route');
var memosRouter = require('./routes/memo-route');
var designTemplatesRouter = require('./routes/designTemplate-route');
var authRouter = require('./routes/auth-route');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Configure morgan logging based on environment
if (process.env.NODE_ENV === 'production') {
  // Production: Use combined format for comprehensive logging
  app.use(logger('combined'));
} else {
  // Development: Use custom format for API requests with detailed info
  const customFormat = ':method :url :status :res[content-length] - :response-time ms - :date[iso]';
  app.use(logger(customFormat));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/memos', memosRouter);
app.use('/templates', designTemplatesRouter);
app.use('/auth', authRouter);

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
