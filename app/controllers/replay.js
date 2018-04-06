import VizController from './visualization';
import Ember from 'ember';

export default VizController.extend({

renderingService: Ember.inject.service("rendering-service"),

  showVersionbar() {
    this.set('renderingService.showVersionbar', true);
  },
});
