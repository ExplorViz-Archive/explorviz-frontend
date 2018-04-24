import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import $ from "jquery";

export default Component.extend(AlertifyHandler, {

  store: service(),

  classNames: ["relative scroll-container"],

  showSpinner: false,

  // @Override
  init() {
    this._super(...arguments);
    
    // enable bootstrap tooltip effect
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip(); 
    });
  },

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
    this.showAlertifyMessage("Agent updated. Click on <b>Discovery</b> to go back.");
  }

});