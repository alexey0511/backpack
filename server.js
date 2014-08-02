// var express = require("express");
// var logfmt = require("logfmt");
// var app = express();
// app.set('port', process.env.PORT || 80);

// app.use(logfmt.requestLogger());
// app.use(express.static('app'));
// app.listen(process.env.PORT);

// app.post('/*', function(req, res){
  // res.sendfile('index.html');
// });



// var server = http.createServer(app);
// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());
app.use(express.static('./app'));
//app.listen(process.env.PORT);

app.get('/', function(req, res) {
  res.send('Hello World! PORT: ' +process.env.PORT);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

 app.post('/*', function(req, res){
   res.sendfile('./app/index1.html');
 });
