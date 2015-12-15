// Require language extensions BEFORE anything else
require('../ext');
var m = require('mithril');

var app = require('./components/app');

m.route(document.getElementById('app'), '/', {
  '/': app
});
