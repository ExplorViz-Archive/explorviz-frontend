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

  ENV['ember-simple-auth'] = {
    routeAfterAuthentication: 'visualization',
    routeIfAlreadyAuthenticated: 'visualization'
  };

  if (environment === 'development') {
    ENV.APP.API_ROOT = 'http://localhost:8083';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.rootURL = '/explorviz-frontend';
    ENV.APP.API_ROOT = '/explorviz-backend';

  }

  if (environment === 'akr') {
    ENV.APP.API_ROOT = 'http://192.168.247.129:8081';
  }

  if (environment === 'mac') {
    ENV.APP.API_ROOT = 'http://192.168.48.205:8081';
  }

  return ENV;
};
