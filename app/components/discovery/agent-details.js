import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import { computed } from '@ember/object';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  store: service(),

  showSpinner: false,

  fullName: computed('agent.name', function() {
    return this.get('agent.name');
  }),

  actions: {

    saveAgent() {
      const self = this;

      if(this.get('agent.hasDirtyAttributes')){
        this.set('showSpinner', true);

        this.get('agent').save().then(() => {
          self.set('showSpinner', false);
          self.handleMessageForUser();     
        })
        .catch((errorObject) => {
          self.get('agent').rollbackAttributes();

          self.set('agent.errorOccured', true);
          self.set('agent.errorMessage', errorObject);

          // closure action from discovery controller
          self.errorHandling(errorObject);
        });   
      } else {
        self.handleMessageForUser();
      }      
    }

  },

  handleMessageForUser() {
    AlertifyHandler.showAlertifyMessage("Agent updated. Click on <b>Discovery</b> to go back.");
  }

});