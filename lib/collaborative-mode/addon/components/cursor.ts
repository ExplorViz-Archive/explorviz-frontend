import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CollaborativeSettingsService from 'explorviz-frontend/services/collaborative-settings-service';

interface CursorArgs {
  cursorData: {
    x: number,
    y: number,
    color: string
  };
}

export default class Cursor extends Component<CursorArgs> {

  @service('collaborative-settings-service')
  settings!: CollaborativeSettingsService;

  get left() {
    return `${this.args.cursorData.x}px`;
  }

  get top() {
    return `${this.args.cursorData.y}px`;
  }

  get color() {
    return this.settings.color
    // return this.args.cursorData.color || 'grey';
  }
}
