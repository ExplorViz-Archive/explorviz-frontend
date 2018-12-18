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

    console.log(`Development mode: Using ${API_ROOT} as API_ROOT`.yellow);
  }

  if (environment === 'production') {

    var rootURL = '/explorviz-frontend';
    var API_ROOT = '/explorviz-backend';

    if(process.env.ROOT_URL) {
      rootURL = process.env.ROOT_URL;
      console.log(`Production mode: Using ${rootURL} as rootURL`.yellow);
    } else {
      console.log(`ATTENTION: Production mode, but using default value ${rootURL} as rootURL`.yellow);
    }

    if(process.env.API_ROOT) {
      API_ROOT = process.env.API_ROOT;
      console.log(`Production mode: Using ${API_ROOT} as API_ROOT`.yellow);
    } else {
      console.log(`ATTENTION: Production mode, but using default value ${rootURL} as rootURL`.yellow);
    }

    ENV.rootURL = rootURL;
    ENV.APP.API_ROOT = API_ROOT;
  }

  if (environment === 'mocked') {
    var API_ROOT = 'http://localhost:4200/api';
    ENV.APP.API_ROOT = 'http://localhost:4200/api';
    console.log(`Mocked API mode: Using ${API_ROOT} as API_ROOT`.yellow);
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
