import Ember from 'ember';
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
export default Controller.extend({

  session: inject.service('session'),
  visualization: inject.controller(),
  landscapeRepo: inject.service("repos/landscape-repository"),
  renderingService: inject.service("rendering-service"),

  actions: {

    resetToLandscapeView() {
      this.get('visualization').send('resetView');
      this.set('landscapeRepo.latestApplication', null);
    },

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
    }
  },

  username: computed(function(){
    return this.get('session').session.content.authenticated.username;
  })

});