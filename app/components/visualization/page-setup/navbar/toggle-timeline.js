import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  tagName: '',

  renderingService: service("rendering-service"),
  
  actions: {
    toggleTimeline() {
      this.set('renderingService.showTimeline', !this.get('renderingService.showTimeline'));
    }
  }

});
