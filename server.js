var express = require("express");
var logfmt = require("logfmt");
var app = express();
app.use(logfmt.requestLogger());
app.use(express.static(''));
app.listen(process.env.PORT || 5000);

app.get('/', function(req, res) {
   res.sendfile('./index1.html');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

 app.post('/*', function(req, res){
   res.sendfile('./index1.html');
 });