var express = require('express')
var logfmt = require("logfmt");
var app = express();

app.listen(process.env.PORT);

app.use(logfmt.requestLogger());

app.set('port', (process.env.PORT || 5000))

app.get('/', function(request, response) {
  response.send(cool());
});


app.get('/', function(req, res) {
  res.send('Hello World! PORT: ' +process.env.PORT);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

 app.post('/*', function(req, res){
   res.sendfile('./index1.html')
 });
