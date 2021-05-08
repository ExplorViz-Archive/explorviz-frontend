import Component from '@glimmer/component';
import { action } from '@ember/object';

interface XrCollaborationArgs {
  removeComponent(componentPath: string): void
}

export default class ArSettingsSelector extends Component<XrCollaborationArgs> {
  @action
  close() {
    this.args.removeComponent('ar-settings-selector');
  }
}
