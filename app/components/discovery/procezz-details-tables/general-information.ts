import Component from '@glimmer/component';
import { computed } from '@ember/object';
import Procezz from 'explorviz-frontend/models/procezz';

interface Args {
  procezz: Procezz,
  toggleProcezzVisibility(): void
}

export default class GeneralInformation extends Component<Args> {

  @computed('args.procezz.lastDiscoveryTime')
  get lastDiscoveryTimeAsDate() {
    const lastDiscoveryTime = this.args.procezz.lastDiscoveryTime;
    return new Date(lastDiscoveryTime).toLocaleString();
  }

}