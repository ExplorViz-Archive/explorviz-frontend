import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  store: service(),

  showSpinner: false,

  monitoredFlag: null,

  // @Override
  willInsertElement: function(){
    this._super(...arguments);
    // Save the monitoring flag on component setup
    // We can therefore use it to show a message for the user
    // (showMessageForUser)  
    const monitoredFlag = this.get('procezz.monitoredFlag');
    this.set('monitoredFlag', monitoredFlag); 
  },

  actions: {

    saveProcezz() {
      const self = this;

      if(this.get('procezz.hasDirtyAttributes')){
        this.set('showSpinner', true);

        this.get('procezz').save({include: 'agent'}).then(() => {
          self.set('showSpinner', false);
          self.showMessageForUser(self.buildUpdateMessageForUser(true));     
        })
        .catch((errorObject) => {

          self.get('procezz').rollbackAttributes();

          self.set('procezz.errorOccured', true);
          self.set('procezz.errorMessage', errorObject);

          // closure action from discovery controller
          self.errorHandling(errorObject);
        });
      } else {
        self.showMessageForUser(self.buildUpdateMessageForUser(false));
      }
    }, 

    restartProcezz() {

      const self = this;

      // this attribute will trigger the agent
      // to restart the procezz
      this.set('procezz.restart', true);
      this.set('procezz.stopped', false);

      this.set('showSpinner', true);

      this.get('procezz').save({
        include: 'agent'
      })
      .then(() => {
        self.set('showSpinner', false);
        self.showMessageForUser(self.buildRestartMessageForUser());     
      })
      .catch((errorObject) => {
        self.get('procezz').rollbackAttributes();
       
        // closure action from discovery controller
        self.errorHandling(errorObject);
      });
    },

    stopProcezz() {

      const self = this;

      // this attribute will trigger the agent
      // to stop the procezz      
      this.set('procezz.stopped', true);
      this.set('procezz.restart', false);

      this.set('showSpinner', true);

      this.get('procezz').save({
        include: 'agent'
      })
      .then(() => {
        self.set('showSpinner', false);
        self.showMessageForUser("Procezz was stopped.");     
      })
      .catch((errorObject) => {
        self.get('procezz').rollbackAttributes();
       
        // closure action from discovery controller
        self.errorHandling(errorObject);
      });
    }
  },

  buildRestartMessageForUser() {
    const mainMessage = "Procezz restarted.";
    let monitoringMessage = "";

    const monitoredFlag = this.get('procezz').get('monitoredFlag');
    const oldMonitoredFlag = this.get('monitoredFlag');

    if(monitoredFlag !== oldMonitoredFlag && monitoredFlag) {
      // was set from off to on
      monitoringMessage = "Monitoring was started.";
    }
    else if(monitoredFlag !== oldMonitoredFlag && !monitoredFlag) {
      // was set from on to off
      monitoringMessage = "Monitoring was stopped.";
    }

    return `${mainMessage} ${monitoringMessage}`;
  },

  buildUpdateMessageForUser(hasDirtyAttributes) {    

    let mainMessage = "No change detected.";

    if(hasDirtyAttributes) {
      mainMessage = "Procezz updated.";
    }

    return mainMessage;
  },

  showMessageForUser(message) {

    this.set('monitoredFlag', this.get('procezz').get('monitoredFlag'));

    AlertifyHandler.showAlertifyMessageWithDuration(
      `${message} Click on <b>Discovery</b> to go back.`, 4);
  }

});