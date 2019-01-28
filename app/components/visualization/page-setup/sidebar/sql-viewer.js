import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({
  // No Ember generated container
  tagName: '',
  landscapeRepo: service("repos/landscape-repository"),
  additionalData: service('additional-data'),
  store: service(),

  actions: {
    queryClicked(query){
      // allow deselection of query
      if (query.get('isSelected')){
        query.set('isSelected', false);
        return;
      }
      // deselect potentially selected query
      let queries = this.get('store').peekAll('databasequery');
      queries.forEach((query) => {
        query.set('isSelected', false);
      });
      // mark new query as selected
      query.set('isSelected', true);
    },

    close() {
      this.get('additionalData').removeComponent("visualization/page-setup/sidebar/sql-viewer");
    },
  },

});
