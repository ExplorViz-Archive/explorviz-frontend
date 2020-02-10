import { computed } from '@ember/object';
import Component from '@glimmer/component';
import Procezz from 'explorviz-frontend/models/procezz';

interface IArgs {
  procezz: Procezz;
  toggleProcezzVisibility(): void;
}

export default class GeneralInformation extends Component<IArgs> {
  tooltipTexts = {
    id: 'Entity ID used by ExplorViz',
    isHidden: `Hide this process. It will not be visible on the overview page.
      Enable 'Show hidden entities' in settings dialog to undo.`,
    lastDiscoveryTimeAsDate: `Last time this process was discovered. Does not show actual
      start time of process, but date when agent discovered this process.`,
    name: `Name attribute has a higher priority than PID in all views.
      This attribute will also be considered for monitoring.
      If it's not filled, a monitored application will be named after the PID.`,
    pid: 'Unique Process ID from Operating System. Will be updated if process is restarted.',
    programmingLanguage: 'Underlying programming language for this procezz',
    webserverFlag: 'Mark a process as web server. This attribute is only for your information.',
  };

  @computed('args.procezz.lastDiscoveryTime')
  get lastDiscoveryTimeAsDate() {
    const { lastDiscoveryTime } = this.args.procezz;
    return new Date(lastDiscoveryTime).toLocaleString();
  }
}
