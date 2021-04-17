import { action } from '@ember/object';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CollaborativeService from 'explorviz-frontend/services/collaborative-service';
import CollaborativeSettingsService from 'explorviz-frontend/services/collaborative-settings-service';

interface Args {
  addComponent(componentPath: string): void
}

export default class CollaborativeSettingsOpener extends Component<Args> {
  @service('collaborative-service')
  collaborativeService!: CollaborativeService;

  @service('collaborative-settings-service')
  settings!: CollaborativeSettingsService;

  @action
  showCollaborativeSettings() {
    this.args.addComponent('collaborative-settings');
    if (!this.settings.connected) {
      this.collaborativeService.openSocket(this.settings.username);
    }
  }
}
