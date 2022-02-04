/* jshint node: true */

/* eslint no-console: 0 */

const DOTENV = require('dotenv');
var colors = require('colors'); // eslint-disable-line

module.exports = function initEnvironment(environment) {
  const path = { path: process.env.DOTENV };

  const P_ENV = process.env;

  if (P_ENV.DOTENV) {
    DOTENV.config(path);
  } else if (environment === 'production') {
    console.log('EXPL-WARNING: This is production mode. You must override the following variables via Docker environment variables in a Docker Compose file:'.yellow);
    console.log('- LANDSCAPE_URL'.yellow);
    console.log('- TRACE_URL'.yellow);
    console.log('- USER_URL'.yellow);
    console.log('- COLLAB_URL'.yellow);
    console.log('- VR_URL'.yellow);
    console.log('- FRONTEND_HOST_NAME'.yellow);
    console.log('... depending on your deployment, e.g., reverse proxy in use.'.yellow);

    DOTENV.config({ path: '.env-prod' });
  } else {
    DOTENV.config();
  }

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
      clientId: P_ENV.AUTH0_CLIENT_ID,
      domain: P_ENV.AUTH0_DOMAIN,
      logoUrl: P_ENV.AUTH0_LOGO_URL,
      callbackUrl: P_ENV.AUTH0_CALLBACK_URL,
      logoutReturnUrl: P_ENV.AUTH0_LOGOUT_URL,
      routeAfterLogin: P_ENV.AUTH0_ROUTE_AFTER_LOGIN,
      accessToken: P_ENV.AUTH0_DISABLED_ACCESS_TOKEN,
      profile: {
        name: P_ENV.AUTH0_DISABLED_PROFILE_NAME,
        nickname: P_ENV.AUTH0_DISABLED_NICKNAME,
        sub: P_ENV.AUTH0_DISABLED_SUB,
      },
    },
    backendAddresses: {
      landscapeService: P_ENV.LANDSCAPE_SERV_URL,
      traceService: P_ENV.TRACE_SERV_URL,
      userService: P_ENV.USER_SERV_URL,
      collaborativeService: P_ENV.COLLAB_SERV_URL,
      vrService: P_ENV.VR_SERV_URL,
      vrSocketPath: P_ENV.VR_SOCKET_PATH,
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

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
