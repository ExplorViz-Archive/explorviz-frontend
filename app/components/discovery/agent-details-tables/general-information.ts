import { computed } from '@ember/object';
import Component from '@glimmer/component';
import Agent from 'explorviz-frontend/models/agent';

interface IArgs {
  agent: Agent;
  toggleAgentVisibility(): void;
}

export default class GeneralInformation extends Component<IArgs> {
  @computed('args.agent.lastDiscoveryTime')
  get lastDiscoveryTimeAsDate() {
    const lastDiscoveryTime = this.args.agent.lastDiscoveryTime;
    return new Date(lastDiscoveryTime).toLocaleString();
  }
}
