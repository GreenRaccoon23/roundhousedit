var Path = require('path');
var browserify = require('browserify-middleware');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var root = __dirname.replace(/^(.*)\/.*$/, '$1');
console.log('root', root);

// app.set('views', __dirname + '/client');
// app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(root + '/client'));

//
// Serve a browserified file for GET /scripts/app-bundle.js
//
app.get('/',
   // browserify('./client/components/app.js'));
function(req, res) {
  res.redirect('/client/index')
})

var port = process.env.PORT || 4000;
app.listen(port);
console.log("Listening on port", port);
