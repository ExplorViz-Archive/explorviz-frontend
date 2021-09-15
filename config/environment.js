/* jshint node: true */

/* eslint no-console: 0 */

var colors = require('colors'); // eslint-disable-line
const AUTH_CONFIG = require('./auth0-variables');
const BACKEND_CONFIG = require('./backend-addresses');

module.exports = function initEnvironment(environment) {
  const ENV = {
    modulePrefix: 'explorviz-frontend',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },
    auth0: {
      clientId: AUTH_CONFIG.clientId,
      domain: AUTH_CONFIG.domain,
      logoUrl: AUTH_CONFIG.logoUrl,
      callbackUrl: AUTH_CONFIG.callbackUrl,
      logoutReturnUrl: AUTH_CONFIG.logoutReturnUrl,
      routeAfterLogin: AUTH_CONFIG.routeAfterLogin,
      accessToken: AUTH_CONFIG.accessToken,
      profile: AUTH_CONFIG.profile,
    },
    backendAddresses: {
      landscapeService: BACKEND_CONFIG.landscapeService,
      traceService: BACKEND_CONFIG.traceService,
      userService: BACKEND_CONFIG.userService,
      collaborativeService: BACKEND_CONFIG.collaborativeService,
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'production') {
    console.log('EXPL-WARNING: This is production mode. You may override the following variables via Docker environment variables in a Docker Compose file:'.yellow);
    console.log('- LANDSCAPE_URL'.yellow);
    console.log('- TRACE_URL'.yellow);
    console.log('- USER_URL'.yellow);
    console.log('- COLLAB_URL'.yellow);
    console.log('- FRONTEND_HOST_NAME'.yellow);
    console.log('... depending on your deployment, e.g., reverse proxy in use.'.yellow);

    ENV.backendAddresses.landscapeService = 'change-landscape-url';
    ENV.backendAddresses.traceService = 'change-trace-url';
    ENV.backendAddresses.userService = 'change-user-url';
    ENV.backendAddresses.collaborativeService = 'change-collab-url';

    ENV.auth0.logoUrl = ENV.auth0.logoUrl.replace("localhost", "change-frontend-host-name");
    ENV.auth0.callbackUrl = ENV.auth0.callbackUrl.replace("localhost", "change-frontend-host-name");
    ENV.auth0.logoutReturnUrl = ENV.auth0.logoutReturnUrl.replace("localhost", "change-frontend-host-name");

  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    ENV.APP.autoboot = false;

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  return ENV;
};
