/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {

  var app = new EmberApp(defaults, {
    sassOptions: {},
    fingerprint: {
      exclude: ['images']
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('vendor/three/three.min.js');
  app.import('vendor/three/THREE.MeshLine.js');
  app.import('vendor/momentjs/moment.js');
  app.import('vendor/chartjs/Chart.min.js');
  app.import('vendor/chartjs/chartjs-plugin-zoom.min.js');
  app.import('vendor/layout/klay.js');

  return app.toTree();
};