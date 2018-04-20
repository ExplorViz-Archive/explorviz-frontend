import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Controller.extend(AlertifyHandler, {

  procezzForDetailView: null,
  agentForDetailView: null,

  renderingService: service("rendering-service"),
  agentReload: service("agent-reload"),

  // closure action for node-overview component
  showDetailsComponent(emberRecord) {
    const modelName = emberRecord.constructor.modelName;

    const possibleModels = ["procezz", "agent"];

    if(possibleModels.includes(modelName)) {
      this.set("agentReload.shallUpdate", false);
      this.set(modelName + 'ForDetailView', emberRecord);
    }    
  },

  setup() {
    this.set('renderingService.showTimeline', false);
    this.resetState();    
  },


  resetState() {
    this.set('procezzForDetailView', null);
    this.set('agentForDetailView', null);
  },

  // closure action for embedded components
  errorHandling(errorArray) {

    if(errorArray) {

      let errorTitle = "There was an error.";
      let errorDetail = "Error occured, but backend returned an invalid error object.";

      let errorObject = errorArray.errors[0];

      if(errorObject) {
        errorTitle = errorObject.title ? errorObject.title : errorTitle;
        errorDetail = errorObject.detail ? errorObject.detail : errorDetail;
      }

      const alertifyMessage = 
        `<b><font color="black">${errorTitle}</font></b>
        ${errorDetail} Your Modification is discarded.`;

      this.showAlertifyMessageWithDuration(alertifyMessage, 8);
    }
    this.resetState();

    // stop first, there might be an old service instance running
    this.get("agentReload").stopUpdate();
    this.get("agentReload").startUpdate();
  }

});