import Component from '@glimmer/component';
import { computed } from '@ember/object';
import Agent from 'explorviz-frontend/models/agent';

interface Args {
  agent: Agent
}

export default class GeneralInformation extends Component<Args> {

  @computed('args.agent.lastDiscoveryTime')
  get lastDiscoveryTimeAsDate() {
    const lastDiscoveryTime = this.args.agent.lastDiscoveryTime;
    return new Date(lastDiscoveryTime).toLocaleString();
  }

}