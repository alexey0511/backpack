var express = require("express");
var logfmt = require("logfmt");
var app = express();
app.use(logfmt.requestLogger());
app.use(express.static('../'));
app.listen(process.env.PORT);

app.get('/*', function(req, res) {
   res.sendfile('app/services.js')

});


 app.post('/*', function(req, res){
   res.sendfile('app/index1.html')
 });
