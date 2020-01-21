import Component from '@glimmer/component';
import { computed, action, set } from '@ember/object';
import { htmlSafe } from '@ember/string';
import Procezz from 'explorviz-frontend/models/procezz';

interface Args {
  procezz: Procezz
}

export default class ExecutionInformation extends Component<Args> {

  @computed('args.procezz.workingDirectory')
  get workingDirectory() {
    const workingDirectory = this.args.procezz.workingDirectory;

    const fallbackString = '<font color="red"><b>ATTENTION</b></font>: ' + 
      'Working Directory could not be found. Check if execution path looks ' +
      'valid.';

    const htmlString = htmlSafe(fallbackString);

    const decisionFlag = workingDirectory !== null && workingDirectory.length > 0;

    return decisionFlag ? workingDirectory : htmlString;
  }

  @action
  setUserExec() {
    const proposedExec = this.args.procezz.proposedExecutionCommand;
    const decisionMakerString = "Use-OS-Exec-CMD";

    if(proposedExec === decisionMakerString) {
      set(this.args.procezz, 'userExecutionCommand', this.args.procezz.osExecutionCommand);
    } else {
      set(this.args.procezz, 'userExecutionCommand', proposedExec);
    }
  }
}