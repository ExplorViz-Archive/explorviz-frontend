import Component from '@glimmer/component';
import { computed } from '@ember/object';
import Procezz from 'explorviz-frontend/models/procezz';

interface Args {
  procezz: Procezz,
  toggleProcezzVisibility(): void
}

export default class GeneralInformation extends Component<Args> {

  tooltipTexts = {
    programmingLanguage: 'Underlying programming language for this procezz',
    id: 'Entity ID used by ExplorViz',
    pid: 'Unique Process ID from Operating System. Will be updated if process is restarted.',
    lastDiscoveryTimeAsDate: `Last time this process was discovered. Does not show actual
      start time of process, but date when agent discovered this process.`,
    name: `Name attribute has a higher priority than PID in all views.
      This attribute will also be considered for monitoring.
      If it's not filled, a monitored application will be named after the PID.`,
    webserverFlag: `Mark a process as web server. This attribute is only for your information.`,
    isHidden: `Hide this process. It will not be visible on the overview page.
      Enable 'Show hidden entities' in settings dialog to undo.`
  }

  @computed('args.procezz.lastDiscoveryTime')
  get lastDiscoveryTimeAsDate() {
    const lastDiscoveryTime = this.args.procezz.lastDiscoveryTime;
    return new Date(lastDiscoveryTime).toLocaleString();
  }

}