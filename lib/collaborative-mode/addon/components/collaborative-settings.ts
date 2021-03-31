import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import CollaborativeSettingsService from 'explorviz-frontend/services/collaborative-settings-service';
import CollaborativeService from 'explorviz-frontend/services/collaborative-service';
import { CollaborativeEvents, UserJoinedMessage } from 'collaborative-mode/utils/collaborative-data';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import { tracked } from '@glimmer/tracking';
import LandscapeTokenService from 'explorviz-frontend/services/landscape-token';

interface CollaborativeSettingsArgs {
  isLandscapeView: Boolean
  removeComponent(componentPath: string): void
  updateView(): void
}

export default class CollaborativeSettings extends Component<CollaborativeSettingsArgs> {

  @service('collaborative-settings-service')
  settings!: CollaborativeSettingsService;

  @service('collaborative-service')
  collaborativeService!: CollaborativeService;

  @service('landscape-token')
  landscapeTokenService!: LandscapeTokenService;

  @tracked
  additionalSettingsVisible: boolean = false;

  @tracked
  meetingId: string = ""

  @action
  toggleAdditionalSettingsVisible() {
    this.additionalSettingsVisible = !this.additionalSettingsVisible;
  }

  @action
  close() {
    this.args.removeComponent('collaborative-settings');
  }

  @action
  closeSocket() {
    this.settings.meeting = undefined;
    this.settings.meetingId = "";
    this.collaborativeService.closeSocket();
  }

  @action
  reconnect() {
    this.collaborativeService.reconnect();
  }

  @action
  leaveMeeting() {
    this.collaborativeService.send(CollaborativeEvents.LeaveMeeting, { meeting: this.settings.meeting?.id });
    this.settings.meeting = undefined;
    this.settings.meetingId = "";
  }

  @action
  joinSession(meetingId: string) {
    this.collaborativeService.send(CollaborativeEvents.JoinMeeting, { meeting: meetingId });
  }

  @action
  createMeeting() {
    const currentToken = this.landscapeTokenService.token!.value;
    this.collaborativeService.send(CollaborativeEvents.CreateMeeting, { landscapeToken: currentToken });
  }

  @action
  jumpToPerspective(user: string) {
    this.collaborativeService.send(CollaborativeEvents.RequestLastPosition, { target: user });
  }

  @action
  giveControl(user: string) {
    this.collaborativeService.send(CollaborativeEvents.TransferControl, { target: user });
  }

  @action
  receiveUserJoined(data: UserJoinedMessage) {
    AlertifyHandler.showAlertifyMessage(data.user + " joined!");
  }
}
