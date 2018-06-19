/* eslint-env node */
'use strict';

module.exports = function(app) {

  // start the server with `ENABLE_MOCK=true ember s --environment=mocked`
  if (process.env.ENABLE_MOCK !== 'true') {
    return;
  }

  const globSync   = require('glob').sync;
  const mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  const proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);

  // Log proxy requests
  const morgan = require('morgan');
  app.use(morgan('dev'));

  mocks.forEach(route => route(app));
  proxies.forEach(route => route(app));
};
