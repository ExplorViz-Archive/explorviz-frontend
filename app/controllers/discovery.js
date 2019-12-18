import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

export default Controller.extend({

  procezzForDetailView: null,
  agentForDetailView: null,

  renderingService: service("rendering-service"),
  agentListener: service("agents-listener"),

  // closure action for node-overview component
  showDetailsComponent(emberRecord) {
    const modelName = emberRecord.constructor.modelName;

    const possibleModels = ["procezz", "agent"];

    if(possibleModels.includes(modelName)) {
      this.set(modelName + 'ForDetailView', emberRecord);
    }    
  },

  setup() {
    this.set('renderingService.showTimeline', false);
    this.set('renderingService.showVersionbar', false);
    this.resetState();
    
    // start SSE transmission from backend
    this.get('agentListener').initSSE();
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

      AlertifyHandler.showAlertifyMessageWithDuration(alertifyMessage, 8);
    }
    this.resetState();
  }

});