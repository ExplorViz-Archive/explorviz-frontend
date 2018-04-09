import Ember from 'ember';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';
import ENV from 'explorviz-frontend/config/environment';

const { Controller, inject, computed } = Ember;
/**
* TODO
*
* @class Application-Controller
* @extends Ember.Controller
*
* @module explorviz
* @submodule page
*/
export default Controller.extend(AlertifyHandler, FileSaverMixin, {

  ajax: inject.service('ajax'),
  session: inject.service('session'),
  visualization: inject.controller(),
  landscapeRepo: inject.service("repos/landscape-repository"),
  renderingService: inject.service("rendering-service"),
  reloadHandler: inject.service("reload-handler"),

  actions: {

    exportState() {
      if(this.get('currentRouteName') === 'visualization') {
        try {
          this.get('visualization').send('exportState');
        }
        catch(err) {
          this.debug("Error when exporting URL", err);
        }
      }
    },

    resetView(){
      this.get('visualization').send('resetView');
    },

    exportLandscape(){
      const currentLandscape = this.get('landscapeRepo.latestLandscape');
      const currentTimestamp = currentLandscape.get('timestamp');
      const currentCalls = currentLandscape.get('overallCalls');

      this.get('ajax').raw(ENV.APP.API_ROOT + '/landscape/export/' + currentTimestamp, {
        dataType: 'text',
        options: {
          arraybuffer: true
        }
      }
    ).then((content) => {
      this.saveFileAs(currentTimestamp + '-' + currentCalls +'.expl', content.payload, 'text/plain');
    }).catch((error) => {
      this.debug('error in exportLandscape', error);
    });
  }
  },

  username: computed(function(){
    return this.get('session').session.content.authenticated.username;
  })

});
