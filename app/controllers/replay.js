import VizController from './visualization';
import Ember from 'ember';

export default VizController.extend({

renderingService: Ember.inject.service("rendering-service"),

init(){
  this._super(...arguments);
},

  showVersionbar() {
    this.set('renderingService.showVersionbar', true);
  },

  showReplayLandscape: Ember.computed('landscapeRepo.replayApplication', function() {
    return !this.get('landscapeRepo.replayApplication');
  }),
});
