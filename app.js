/**
 * Created by bryan on 8-12-2016.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var db;

if(process.env.BNV == 'Test')
    db= mongoose.connect('mongodb://localhost/festivalAPI_test');
else
    db= mongoose.connect('mongodb://localhost/festivalAPI');


var festival = require('./models/festivalModel');



var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

festivalRouter = require('./Routes/festivalRoutes')(festival);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, charset");

    next();
});

app.use('/api/festivals', festivalRouter);

app.get('/', function(req, res) {
    res.send('welcome to my api');
});

app.listen(port, function () {
    console.log('gulp is running on port:' + port);
    
});

module.exports = app;