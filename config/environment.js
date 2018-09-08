/* jshint node: true */

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
    ENV.APP.API_ROOT = 'http://localhost:8080';
  }

  if (environment === 'production') {
    ENV.rootURL = '/explorviz-frontend';
    ENV.APP.API_ROOT = '/explorviz-backend';
  }

  if (environment === 'mocked') {
    ENV.APP.API_ROOT = 'http://localhost:4200/api';
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
