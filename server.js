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
var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8888);