import Controller from '@ember/controller';
import { inject as service } from '@ember/service'; 
import { computed } from '@ember/object';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

/**
* TODO
*
* @class Visualization-Controller
* @extends Ember.Controller
*
* @module explorviz
* @submodule visualization
*/
export default Controller.extend(AlertifyHandler, {

  renderingService: service("rendering-service"),
  landscapeRepo: service("repos/landscape-repository"),
  landscapeListener: service("landscape-listener"),
  additionalData: service("additional-data"),
  timestampRepo: service("repos/timestamp-repository"),

  state: null,

  type: 'landscape',

  showLandscape: computed('landscapeRepo.latestApplication', function() {
    return !this.get('landscapeRepo.latestApplication');
  }),


  actions: {
    resetView() {
      this.get('renderingService').reSetupScene();
    },

    openLandscapeView() {
      this.set('landscapeRepo.latestApplication', null);
      this.set('landscapeRepo.replayApplication', null);
    },

    toggleTimeline() {
      this.get('renderingService').toggleTimeline();
    }
    
  },

  showTimeline() {
    this.set('renderingService.showTimeline', true);
  },

  hideVersionbar(){
    this.set('renderingService.showVersionbar', false);
  },

  initRendering() {
    this.get('landscapeListener').initSSE();
    this.get('additionalData').on('showWindow', this, this.onShowWindow);
  },

  onShowWindow() {
    this.get('renderingService').resizeCanvas();
  },

  // @Override
  cleanup() {
    this._super(...arguments);
    this.get('additionalData').off('showWindow', this, this.onShowWindow);
  }
  
});
