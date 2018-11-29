var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var ignoreRouter=require('./config/ignoreRouter');
console.log(ignoreRouter);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
  // req.cookies('username')
  // console.log(req.cookies.nickname);
  // console.log(req.path);
  //排出 登录和注册
  console.log(ignoreRouter.indexOf(req.url));
  console.log(req.url);
  if(ignoreRouter.indexOf(req.url)>-1){
     next();
     console.log(1);
     return;
  }
  var nickname=req.cookies.nickname;
  if(nickname){
   next();
  }else{
    //如果nickname不存在，就跳转到登录页面
    console.log('-----------------------------')
    res.redirect('/login.html');
  }

});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
