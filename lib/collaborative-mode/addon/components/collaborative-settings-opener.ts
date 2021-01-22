import { action } from '@ember/object';
import Component from '@glimmer/component';

interface CollaborativeSettingsOpenerArgs {
  addComponent(componentPath: string): void
}


export default class CollaborativeSettingsOpener extends Component<CollaborativeSettingsOpenerArgs> {


  @action
  showCollaborativeSettings() {
    this.args.addComponent('collaborative-settings');
  }
}
