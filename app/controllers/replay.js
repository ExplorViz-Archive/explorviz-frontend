import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({

  renderingService: service("rendering-service"),
  landscapeRepo: service("repos/landscape-repository"),

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
