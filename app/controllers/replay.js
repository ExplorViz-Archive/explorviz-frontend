import VizController from './visualization';
import { inject as service } from '@ember/service'; 
import { computed } from '@ember/object';

export default VizController.extend({

  renderingService: service("rendering-service"),

  init(){
    this._super(...arguments);
  },

  showVersionbar() {
    this.set('renderingService.showVersionbar', true);
  },

  showReplayLandscape: computed('landscapeRepo.replayApplication', function() {
    return !this.get('landscapeRepo.replayApplication');
  }),
});
