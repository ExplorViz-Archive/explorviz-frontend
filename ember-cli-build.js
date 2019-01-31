/*jshint node:true*/
/* global require, module */
var sass = require('sass');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {

  var app = new EmberApp(defaults, {
    octicons: {
      // load selected icons for popup-handler since it does not (yet) use components / templates
      icons: ['arrow-right', 'arrow-both', 'code', 'list-ordered', 'clock', 'tools']
    },

    // Default implementation for ember-cli-sass
    sassOptions: {
      implementation: sass
    },

    svgJar: {
      sourceDirs: [
        'public', // default SVGJar lookup directory
        'node_modules/octicons/build/svg'
      ]
    },

    'ember-cli-babel': {
      includePolyfill: true
    },

    fingerprint: {
      exclude: ['images']
    },

    nodeModulesToVendor: [
      // add node_modules that you need in vendor modules
      // See: https://www.npmjs.com/package/ember-cli-node-modules-to-vendor
      'node_modules/three/build'
    ],

    'ember-bootstrap': {
      'bootstrapVersion': 4,
      'importBootstrapFont': false,
      'importBootstrapCSS': false
    }
  });

  // export for threex.dynamictexture
  app.import('vendor/three.min.js',{
    prepend: true
  });

  app.import('vendor/layout/klay.js');
  app.import('vendor/threex/threex.rendererstats.min.js');
  app.import('vendor/threex/threex.dynamictexture.min.js');

  app.import('vendor/alertifyjs/alertify.min.js');
  app.import('vendor/alertifyjs/css/alertify.min.css');
  app.import('vendor/alertifyjs/css/themes/default.min.css');

  app.import('vendor/cytoscape/cytoscape.min.js');

  app.import('vendor/eventsource-polyfill/eventsource.min.js');

  app.import('node_modules/bootstrap/dist/js/bootstrap.min.js');

  return app.toTree();
};