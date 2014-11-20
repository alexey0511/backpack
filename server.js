var express = require("express");
var logfmt = require("logfmt");
var app = express();
app.use(logfmt.requestLogger());
app.use('app/', express.static('../app'));
app.listen(process.env.PORT || 5000);

