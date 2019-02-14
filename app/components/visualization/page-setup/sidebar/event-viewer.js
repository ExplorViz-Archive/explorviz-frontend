import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({
  
    // No Ember generated container
  tagName: '',
  landscapeRepo: service("repos/landscape-repository"),
  additionalData: service('additional-data'),
  store: service(),

  actions: {
    eventClicked(event){
      // allow deselection of event
      if (event.get('isSelected')){
        event.set('isSelected', false);
        return;
      }
      // deselect potentially selected event
      let events = this.get('store').peekAll('event');
      events.forEach((event) => {
        event.set('isSelected', false);
      });
      // mark new event as selected
      event.set('isSelected', true);
    },

    close() {
      this.get('additionalData').removeComponent("visualization/page-setup/sidebar/event-viewer");
    },
  },

});

