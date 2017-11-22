import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  store: service(),
  renderingService: service(),
  landscapeRepo: service('repos/landscape-repository'),

  actions: {
    focusEntity() {
      const searchResult = this.findElementByString(this.get('searchString'));

      if(searchResult !== null) {
        this.get('renderingService').focusEntity();
      }
      
    }
  },

  findElementByString(searchString) {
    console.log(this.get('store').peekRecord('component', {name: searchString}));
  }

});
