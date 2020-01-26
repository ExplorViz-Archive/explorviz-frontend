import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Agent from 'explorviz-frontend/models/agent';
import Procezz from 'explorviz-frontend/models/procezz';
import AgentsListener from 'explorviz-frontend/services/agents-listener';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

export default class DiscoveryController extends Controller {
  procezzForDetailView: Procezz|null = null;
  agentForDetailView: Agent|null = null;

  @service('rendering-service')
  renderingService!: RenderingService;

  @service('agents-listener')
  agentListener!: AgentsListener;

  // closure action for node-overview component
  @action
  showDetailsComponent(emberRecord: any) {
    if (emberRecord instanceof Procezz) {
      set(this, 'procezzForDetailView', emberRecord);
    } else if (emberRecord instanceof Agent) {
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
  @action
  errorHandling(errorArray: any) {
    if (errorArray) {
      let errorTitle = 'There was an error.';
      let errorDetail = 'Error occured, but backend returned an invalid error object.';

      const errorObject = errorArray.errors[0];

      if (errorObject) {
        errorTitle = errorObject.title ? errorObject.title : errorTitle;
        errorDetail = errorObject.detail ? errorObject.detail : errorDetail;
      }

      const alertifyMessage =
        `<b><font color="black">${errorTitle}</font></b>
        ${errorDetail} Your Modification is discarded.`;

      const alertifyMessageDuration = 8;
      AlertifyHandler.showAlertifyMessageWithDuration(alertifyMessage, alertifyMessageDuration);
    }
    this.resetState();
  }

  @action
  toggleAgentVisibility() {
    if (this.agentForDetailView) {
      this.agentForDetailView.toggleProperty('isHidden');
    }
  }

  @action
  toggleProcezzVisibility() {
    if (this.procezzForDetailView) {
      this.procezzForDetailView.toggleProperty('isHidden');
    }
  }

  @action
  toggleProcezzWebserverFlag() {
    if (this.procezzForDetailView) {
      this.procezzForDetailView.toggleProperty('webserverFlag');
    }
  }

  @action
  toggleProcezzMonitoredFlag() {
    if (this.procezzForDetailView) {
      this.procezzForDetailView.toggleProperty('monitoredFlag');
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  // tslint:disable-next-line: interface-name
  interface Registry {
    'discoveryController': DiscoveryController;
  }
}
