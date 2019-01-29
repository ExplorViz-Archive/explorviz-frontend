import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  additionalData: service(),
  landscapeRepo: service('repos/landscape-repository'),

  actions: {
    showSql() {
      if (this.get("landscapeRepo.latestApplication.databaseQueries.length") === 0){
        this.showAlertifyMessage("No SQL statements found!");
        return;
      }
      this.get('additionalData').addComponent("visualization/page-setup/sidebar/sql-viewer");
      this.get('additionalData').openAdditionalData();
    },
  },

});
