//var express = require("express");
//var logfmt = require("logfmt");
//var app = express();

//app.use(logfmt.requestLogger());
//app.use(express.static('app'));
//app.listen(process.env.PORT);

var express = require('express');
var http = require('http');
var app = express();

app.set('port', process.env.PORT || 80);

//DEFINE ALL ROUTES
app.get('/', routes.dashboard.index);
app.post('/*', function(request, response) {
  response.redirect('/');
});

//SETUP HTTP LISTENER

server = http.createServer(app);
