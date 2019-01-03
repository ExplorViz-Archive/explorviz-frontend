'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
  ]).then(urls => {
    return {
      useYarn: false,
      scenarios: [
        {
          name: 'ember-lts-2.12',
          npm: {
            devDependencies: {
              'ember-source': '~2.12.0',
            }
          }
        },
        {
          name: 'ember-lts-2.16',
          npm: {
            devDependencies: {
              'ember-source': '~2.16.0',
            }
          }
        },
        {
          name: 'ember-lts-2.18',
          npm: {
            devDependencies: {
              'ember-source': '~2.18.0',
            }
          }
        },
        {
          name: 'ember-lts-3.4.7',
          npm: {
            devDependencies: {
              'ember-source': '~3.4.7',
            }
          }
        },
        {
          name: 'ember-3.5.0',
          npm: {
            devDependencies: {
              'ember-source': '~3.5.0',
            }
          }
        },
        {
          name: 'build with ember-lts-3.4.7',
          command: 'ember build --prod',
          npm: {
            devDependencies: {
              'ember-source': '~3.4.7',
            }
          }
        }
      ]
    };
  });
};
