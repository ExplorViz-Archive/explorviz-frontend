import Ember from 'ember';
const { Controller, inject, computed } = Ember;
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';

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

ajax: inject.service(),
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

this.get('ajax').raw('http://localhost:8083/landscape/export/' + currentTimestamp, {
dataType: 'text',
  options: {
    arraybuffer: true
  }
  }
).then((content) => {
  console.log('content: ', content);
  this.saveFileAs(currentTimestamp + '-' + currentLandscape.get('overallCalls') +'.expl', content.payload, 'text/plain');
}).catch((error) => {
  console.log(error);
});
}
  },

  username: computed(function(){
    return this.get('session').session.content.authenticated.username;
  })

});
