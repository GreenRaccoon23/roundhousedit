var Path = require('path');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var root = __dirname.replace(/^(.*)\/.*$/, '$1');
console.log('root', root);

app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(root + '/client'));

app.get('/', function(req, res) {
  res.redirect('/client/index')
})

var port = process.env.PORT || 4000;
app.listen(port);
console.log("Listening on port", port);
