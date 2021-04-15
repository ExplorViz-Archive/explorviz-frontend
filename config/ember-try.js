const getChannelURL = require('ember-source-channel-url');

// eslint-disable-next-line func-names
module.exports = function () {
  return Promise.all([
    getChannelURL('release'),
  ]).then((/* urls */) => ({
    useYarn: false,
    scenarios: [
      {
        name: 'test-release',
        description: 'test with current release (ember-3.7.0)',
        npm: {
          devDependencies: {
            'ember-source': '~3.7.0',
          },
        },
      },
      {
        name: 'build-release',
        description: 'build with current release (ember-3.7.0)',
        command: 'ember build --prod',
        npm: {
          devDependencies: {
            'ember-source': '~3.7.0',
          },
        },
      },
    ],
  }));
};
