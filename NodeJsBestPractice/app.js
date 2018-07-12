var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
let homeRouter = require('./routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    let cookie = req.cookies;
    console.log('using cookie, userid is: ' + cookie.username);
    console.log('current visiting url: '+req.url);
    if (!cookie.username || cookie.username === 'undefined') {
        if (req.url === '/' || req.url === '/login'|| req.url === '/register') {
            next();
        }
        else {
            console.log('cookie not exists, redirect');
            res.redirect('/');
        }
    } else {
        if(req.url === '/') {
            console.log('user cookie exist, redirect to home page');
            res.redirect('/home');
        } else
            next();
    }
});
app.use('/users', usersRouter);
app.use('/', loginRouter);
app.use('/home',homeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
