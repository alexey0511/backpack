var express = require("express");
var logfmt = require("logfmt");
var app = express();
app.use(logfmt.requestLogger());
<<<<<<< HEAD
app.use(express.static(''));
=======
app.use(express.static('../'));
>>>>>>> 222276fc8bf5baa4bb4a3e162e9821885961bf68
app.listen(process.env.PORT);

app.get('/', function(req, res) {
  res.send('Hello World! PORT: ' +process.env.PORT);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

 app.post('/*', function(req, res){
   res.sendfile('app/index1.html')
 });
