import Controller from '@ember/controller';
import { inject as service } from "@ember/service";

export default Controller.extend({

    renderingService: service("rendering-service"),    

    resetup() {
        this.set('renderingService.showTimeline', false);
        this.set('renderingService.showVersionbar', false);  
      }
});
