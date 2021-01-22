import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import CollaborativeSettingsService from 'explorviz-frontend/services/collaborative-settings-service';
import CollaborativeService from 'explorviz-frontend/services/collaborative-service';

interface CollaborativeSettingsArgs {
  isLandscapeView: Boolean
  removeComponent(componentPath: string): void
  updateView(): void
}

export default class CollaborativeSettings extends Component<CollaborativeSettingsArgs> {

  @service('collaborative-settings-service') settings!: CollaborativeSettingsService;
  @service('collaborative-service') collaborativeService!: CollaborativeService;

  @action
  close() {
    this.args.removeComponent('collaborative-settings');
  }

  @action
  toggleEnabled() {
    if (this.settings.enabled) {
      this.collaborativeService.closeSocket();
    } else {
      this.collaborativeService.openSocket();
    }
    this.settings.enabled = !this.settings.enabled;
  }
  @action
  togglePerspective() {
    this.settings.perspective = !this.settings.perspective;
  }

  @action
  toggleMouseMove() {
    this.settings.mouseMove = !this.settings.mouseMove;
  }

  @action
  toggleMouseStop() {
    this.settings.mouseStop = !this.settings.mouseStop;
  }

  @action
  toggleMouseHover() {
    this.settings.mouseHover = !this.settings.mouseHover;
  }

  @action
  toggleSingleClick() {
    this.settings.singleClick = !this.settings.singleClick;
  }

  @action
  toggleDoubleClick() {
    this.settings.doubleClick = !this.settings.doubleClick;
  }
}
