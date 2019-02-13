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

    if(process.env.API_ROOT) {
      API_ROOT = process.env.API_ROOT;
    }

    ENV.APP.API_ROOT = API_ROOT;

    console.log("");
    console.log(`EXPL-INFO: Development mode: Using ${API_ROOT} as API_ROOT`.blue);
  }

  if (environment === 'production') {

    console.log("");

    var rootURL = 'change-rootURL';
    var API_ROOT = 'change-API_ROOT';

    if(process.env.API_ROOT) {
      console.log(`EXPL-INFO: Using environment variable as API_ROOT`.blue);
      API_ROOT = process.env.API_ROOT;
    }

    if(process.env.ROOT_URL) {
      console.log(`EXPL-INFO: Using environment variable as rootURL`.blue);
      rootURL = process.env.ROOT_URL;
    }

    ENV.rootURL = rootURL;
    ENV.APP.API_ROOT = API_ROOT;

    console.log("");
    console.log(`EXPL-INFO: Production mode: Using ${rootURL} as rootURL`.blue);
    console.log(`EXPL-INFO: Production mode: Using ${API_ROOT} as API_ROOT`.blue);

    if(rootURL == 'change-rootURL' || API_ROOT == 'change-API_ROOT') {
      console.log(`EXPL-WARNING: This is prodution mode. You must override the 'rootURL' variable with its current value: ${rootURL}`.yellow);
      console.log(`EXPL-WARNING: Set the environment variable ROOT_URL=XXX`.yellow);
    }

    if(API_ROOT == 'change-API_ROOT') {
      console.log(`EXPL-WARNING: This is prodution mode. You must override the 'API_ROOT' variable with its current value: ${API_ROOT}`.yellow);
      console.log(`EXPL-WARNING: Set the environment variable API_ROOT=XXX`.yellow);
    }
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

  if (environment === 'czi') {
    ENV.APP.API_ROOT = 'http://192.168.48.215:8080';
  }

  return ENV;
};
