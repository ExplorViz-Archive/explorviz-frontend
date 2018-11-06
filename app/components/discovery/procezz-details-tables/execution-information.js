import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  workingDirectory: computed('procezz.workingDirectory', function() {
      const workingDirectory = this.get('procezz.workingDirectory');

      const fallbackString = '<font color="red"><b>ATTENTION</b></font>: ' + 
        'Working Directory could not be found. Check if execution path looks ' +
        'valid.';

      const htmlString = htmlSafe(fallbackString);

      const decisionFlag = workingDirectory !== null && workingDirectory.length > 0;

      return decisionFlag ? workingDirectory : htmlString;
  }),

  actions: {

    setUserExec() {

      const proposedExec = this.get('procezz.proposedExecutionCommand');
      const decisionMakerString = "Use-OS-Exec-CMD";

      if(proposedExec === decisionMakerString) {
        this.get('procezz').set('userExecutionCommand', this.get('procezz.osExecutionCommand'));
      } else {
        this.get('procezz').set('userExecutionCommand', proposedExec);
      }

    }
  }
});