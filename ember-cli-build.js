/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {

  var app = new EmberApp(defaults, {
    sassOptions: {},
    fingerprint: {
      exclude: ['images']
    },
    nodeModulesToVendor: [
      // add node_modules that you need in vendor modules
      // See: https://www.npmjs.com/package/ember-cli-node-modules-to-vendor
    ]
  });

  app.import('vendor/layout/klay.js');
  app.import('vendor/threex/threex.rendererstats.min.js');

  app.import('vendor/alertifyjs/alertify.min.js');
  app.import('vendor/alertifyjs/css/alertify.min.css');
  app.import('vendor/alertifyjs/css/themes/default.min.css');

  app.import('vendor/d3/d3.min.js');

  app.import('vendor/c3/c3.min.js');
  app.import('vendor/c3/c3.min.css');

  return app.toTree();
};