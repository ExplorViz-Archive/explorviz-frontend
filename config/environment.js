/* jshint node: true */

/* eslint no-console: 0 */

var colors = require('colors'); // eslint-disable-line

module.exports = function (environment) {
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

  var API_ROOT;

  var LOGSTASH_ENABLED;
  var LOGSTASH_HOST;
  var LOGSTASH_URL = "";
  const LOGSTASH_PORT = "4563";

  if (environment === 'development') {

    API_ROOT = 'http://localhost:8080';

    if (process.env.API_ROOT) {
      API_ROOT = process.env.API_ROOT;
    }

    // Logstash
    if (process.env.LOGSTASH_ENABLED) {
      LOGSTASH_ENABLED = (process.env.LOGSTASH_ENABLED.toLowerCase() === 'true')
      if(process.env.LOGSTASH_HOST) {
        LOGSTASH_HOST = process.env.LOGSTASH_HOST;
        LOGSTASH_URL = 'http://' + LOGSTASH_HOST + ":" + LOGSTASH_PORT;
        console.log(`EXPL-INFO: Logstash host set to ${LOGSTASH_URL}.`)
      } else {
        console.log(`EXPL-WARNING: You enabled logging to logstash but did not specify a logstash host. Logstash logging is disabled.`)
        LOGSTASH_ENABLED = false;
      }
    } else{
      LOGSTASH_ENABLED = false;
    }
    ENV.APP.LOGSTASH_ENABLED = LOGSTASH_ENABLED;
    ENV.APP.LOGSTASH_URL = LOGSTASH_URL;
    
    ENV.APP.API_ROOT = API_ROOT;
    

    console.log("");
    console.log(`EXPL-INFO: Development mode: Using ${API_ROOT} as API_ROOT`.blue);
  }

  if (environment === 'production') {

    console.log("");

    // Logstash
    if (process.env.LOGSTASH_ENABLED) {
      LOGSTASH_ENABLED = (process.env.LOGSTASH_ENABLED.toLowerCase() === 'true')
      if(process.env.LOGSTASH_HOST) {
        LOGSTASH_HOST = process.env.LOGSTASH_HOST;
        LOGSTASH_URL = 'http://' + LOGSTASH_HOST + ":" + LOGSTASH_PORT;
        console.log(`EXPL-INFO: Logstash host set to ${LOGSTASH_URL}.`)
      } else {
        console.log(`EXPL-WARNING: You enabled logging to logstash but did not specify a logstash host. Logstash logging is disabled.`)
        LOGSTASH_ENABLED = false;
      }
    } else{
      LOGSTASH_ENABLED = false;
    }
    ENV.APP.LOGSTASH_ENABLED = LOGSTASH_ENABLED;
    ENV.APP.LOGSTASH_URL = LOGSTASH_URL;

    //var rootURL = 'change-rootURL';
    API_ROOT = 'change-API_ROOT';

    if (process.env.API_ROOT) {
      console.log(`EXPL-INFO: Using environment variable as API_ROOT`.blue);
      API_ROOT = process.env.API_ROOT;
    }

    ENV.APP.API_ROOT = API_ROOT;

    console.log("");
    console.log(`EXPL-INFO: Production mode: Using ${API_ROOT} as API_ROOT`.blue);

    if (API_ROOT == 'change-API_ROOT') {
      console.log(`EXPL-WARNING: This is prodution mode. You must override the 'API_ROOT' variable with its current value: ${API_ROOT}`.yellow);
      console.log(`EXPL-WARNING: Set the environment variable API_ROOT=XXX`.yellow);
    }
  }

  if (environment === 'mocked') {
    ENV.APP.LOGSTASH_ENABLED = false;
    API_ROOT = 'http://localhost:4200/api';
    ENV.APP.API_ROOT = 'http://localhost:4200/api';
    console.log(`EXPL-INFO: Mocked API mode: Using ${API_ROOT} as API_ROOT`.blue);
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';
    ENV.APP.LOGSTASH_ENABLED = false;

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  // User specific environment, e.g. for usage in a virtual machine

  if (environment === 'akr') {
    ENV.APP.API_ROOT = 'http://192.168.91.128:8080';
  }

  if (environment === 'akr-mocked') {
    ENV.APP.API_ROOT = 'http://192.168.91.128:4200/api';
  }

  if (environment === 'node2') {
    ENV.APP.API_ROOT = 'http://192.168.48.32:8090';
  }

  return ENV;
};
