var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var busboy = require('connect-busboy'); // Form parsing

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Form parser and conf
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Max size of internal stream buffer
    limits: {
        fileSize: 10 * 1024 * 1024,
        parts: 256,
        files: 16,
        headerPairs: 1000,
        fieldSize: 1024,
        fields: 128
    }
}));

app.use('/', routes);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
