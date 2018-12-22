/* jshint node: true */

var colors = require('colors');

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'explorviz-frontend',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {

    var API_ROOT = 'http://localhost:8080';
    ENV.APP.API_ROOT = API_ROOT;

    console.log("");
    console.log(`EXPL-INFO: Development mode: Using ${API_ROOT} as API_ROOT`.blue);
  }

  if (environment === 'production') {

    var rootURL = 'change-rootURL';
    var API_ROOT = 'change-API_ROOT';    
    ENV.rootURL = rootURL;
    ENV.APP.API_ROOT = API_ROOT;

    console.log("");
    console.log(`EXPL-INFO: Production mode: Using ${rootURL} as rootURL`.blue);
    console.log(`EXPL-INFO: Production mode: Using ${API_ROOT} as API_ROOT`.blue);
    console.log(`EXPL-INFO: If you are using Docker, then override these values with environment variables`.blue);
  }

  if (environment === 'mocked') {
    var API_ROOT = 'http://localhost:4200/api';
    ENV.APP.API_ROOT = 'http://localhost:4200/api';
    console.log(`EXPL-INFO: Mocked API mode: Using ${API_ROOT} as API_ROOT`.blue);
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  // User specific environment, e.g. for usage in a virtual machine

  if (environment === 'akr') {
    ENV.APP.API_ROOT = 'http://192.168.91.132:8080';
  }

  if (environment === 'akr-mocked') {
    ENV.APP.API_ROOT = 'http://192.168.91.132:4200/api';
  }

  return ENV;
};
