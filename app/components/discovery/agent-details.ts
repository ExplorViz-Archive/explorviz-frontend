import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import { action, set } from '@ember/object';
import DS from 'ember-data';
import Agent from 'explorviz-frontend/models/agent';

interface Args {
  agent: Agent,
  errorHandling(errorArray:any): void,
  toggleAgentVisibility(): void
}

export default class AgentDetails extends Component<Args> {

  @service('store') store!: DS.Store;

  @tracked
  showSpinner = false;

  @action
  saveAgent() {
    const self = this;

    let agent = this.args.agent;

    if(agent.get('hasDirtyAttributes')){
      this.showSpinner = true;

      agent.save().then(() => {
        self.showSpinner = false;
        self.handleMessageForUser();
      })
      .catch((errorObject) => {
        agent.rollbackAttributes();

        set(agent, 'errorOccured', true);
        set(agent, 'errorMessage', errorObject);

        // closure action from discovery controller
        self.args.errorHandling(errorObject);
      });   
    } else {
      self.handleMessageForUser();
    }      
  }

  handleMessageForUser() {
    AlertifyHandler.showAlertifyMessage("Agent updated. Click on <b>Discovery</b> to go back.");
  }

}