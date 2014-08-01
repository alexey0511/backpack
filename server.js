var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());
app.use(express.static('app'));
app.listen(process.env.PORT);

app.post('/*', function(req, res){
  res.sendfile('index.html');
});
