import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import CollaborativeSettingsService from 'explorviz-frontend/services/collaborative-settings-service';
import CollaborativeService from 'explorviz-frontend/services/collaborative-service';
import { CollaborativeEvents, PresentationModeActivated, SessionData, UserJoinedMessage } from 'collaborative-mode/utils/collaborative-data';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

interface CollaborativeSettingsArgs {
  isLandscapeView: Boolean
  removeComponent(componentPath: string): void
  updateView(): void
}

export default class CollaborativeSettings extends Component<CollaborativeSettingsArgs> {

  get toggles() {
    return [
      {
        visible: !this.settings.presentationMode,
        name: 'Follow Camera?', tooltip: 'Follow camera movement',
        value: this.settings.perspective, onToggle: this.togglePerspective
      },
      {
        visible: !this.settings.presentationMode,
        name: 'Mouse move?', tooltip: 'Show mouse movement of others',
        value: this.settings.mouseMove, onToggle: this.toggleMouseMove
      },
      {
        visible: !this.settings.presentationMode,
        name: 'Mouse stop?', tooltip: 'Show tooltips.',
        value: this.settings.mouseMove, onToggle: this.toggleMouseStop
      },
      {
        visible: !this.settings.presentationMode,
        name: 'Mouse hover?', tooltip: 'Show highlighted objects',
        value: this.settings.mouseHover, onToggle: this.toggleMouseHover
      },
      {
        visible: !this.settings.presentationMode,
        name: 'Single Click?', tooltip: 'Follow single clicks',
        value: this.settings.singleClick, onToggle: this.toggleSingleClick
      },
      {
        visible: !this.settings.presentationMode,
        name: 'Double Click?', tooltip: 'Follow Double clicks',
        value: this.settings.doubleClick, onToggle: this.toggleDoubleClick
      },
      {
        visible: this.settings.admin,
        name: 'Presentation Mode?', tooltip: 'When selected, only one user is allowed to interact',
        value: this.settings.presentationMode, onToggle: this.togglePresentationMode
      }
    ];
  }

  @service('collaborative-settings-service')
  settings!: CollaborativeSettingsService;

  @service('collaborative-service')
  collaborativeService!: CollaborativeService;

  @action
  close() {
    this.args.removeComponent('collaborative-settings');
  }

  @action
  leaveSession() {
    this.collaborativeService.closeSocket();
    this.settings.enabled = false;
  }

  @action
  joinSession() {
    this.collaborativeService.openSocket(this.settings.sessionId, this.settings.username);
    this.settings.enabled = true;
  }

  @action
  createSession() {
    const sessionId = 'S' + Math.floor(Math.random() * Math.floor(100))
    this.settings.sessionId = sessionId;
    this.collaborativeService.openSocket(sessionId, this.settings.username);
    this.settings.enabled = true;
    this.settings.userInControl = this.settings.username;
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

  @action
  togglePresentationMode() {
    this.settings.presentationMode = !this.settings.presentationMode;
    if (this.settings.presentationMode) {
      this.collaborativeService.send(CollaborativeEvents.PresentationModeActivated, {});
    } else {
      this.collaborativeService.send(CollaborativeEvents.PresentationModeDeactivated, {});
    }
  }

  @action
  jumpToPerspective(user: string) {
    this.collaborativeService.send(CollaborativeEvents.GetPerspective, {}, user);
  }

  @action
  onPresentationModeActivated(data: PresentationModeActivated) {
    this.settings.presentationMode = true;
    this.settings.userInControl = data.user;
  }

  @action
  onPresentationModeDeactivated() {
    this.settings.presentationMode = false;
  }

  @action
  onUserInControl(data: any) {
    this.settings.userInControl = data.user;
    AlertifyHandler.showAlertifyMessage(this.settings.userInControl + " got control.");
  }

  @action
  giveControl(user: string) {
    this.settings.userInControl = user;
    this.collaborativeService.send(CollaborativeEvents.UserInControl, { user: user });
  }

  @action
  receiveUserList(data: SessionData) {
    this.settings.users.clear();
    this.settings.users.pushObjects(data.users);
    if (data.users.length > 1) {
      this.settings.admin = false;
      AlertifyHandler.showAlertifyMessage("You are not the admin!");
    }
  }

  @action
  receiveUserJoined(data: UserJoinedMessage) {
    AlertifyHandler.showAlertifyMessage(data.user + " joined!");
    this.settings.users.pushObject(data.user);
    this.collaborativeService.send(CollaborativeEvents.UserInControl, { user: this.settings.userInControl }, data.user);
  }


}
