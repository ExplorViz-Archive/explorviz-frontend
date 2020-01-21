import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import AgentsListener from 'explorviz-frontend/services/agents-listener';
import Procezz from 'explorviz-frontend/models/procezz';
import Agent from 'explorviz-frontend/models/agent';
import { set } from '@ember/object';

export default class DiscoveryController extends Controller {

  procezzForDetailView:Procezz|null = null;
  agentForDetailView:Agent|null = null;

  @service('rendering-service')
  renderingService!: RenderingService;

  @service('agents-listener')
  agentListener!: AgentsListener;

  // closure action for node-overview component
  showDetailsComponent(emberRecord:any) {
    if(emberRecord instanceof Procezz) {
      set(this, 'procezzForDetailView', emberRecord);
    } else if(emberRecord instanceof Agent) {
      set(this, 'agentForDetailView', emberRecord);
    }
  }

  setup() {
    set(this.renderingService, 'showTimeline', false);
    set(this.renderingService, 'showVersionbar', false);
    this.resetState();
    
    // start SSE transmission from backend
    this.agentListener.initSSE();
  }


  resetState() {
    set(this, 'procezzForDetailView', null);
    set(this, 'agentForDetailView', null);
  }

  // closure action for embedded components
  errorHandling(errorArray:any) {

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

}