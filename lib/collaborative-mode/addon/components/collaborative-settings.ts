import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import CollaborativeSettingsService from 'explorviz-frontend/services/collaborative-settings-service';
import CollaborativeService from 'explorviz-frontend/services/collaborative-service';
import { CollaborativeEvents, PresentationModeActivated, SessionData, UserJoinedMessage } from 'collaborative-mode/utils/collaborative-data';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import { tracked } from '@glimmer/tracking';

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
    console.log("Leave meeting")
    this.collaborativeService.send("leave_meeting", {meeting: this.settings.meeting?.id});
    this.settings.meeting = undefined;
    this.settings.meetingId = "";
  }

  @action
  joinSession(meetingId: string) {
    this.collaborativeService.send("join_meeting", {meeting: meetingId});
  }

  @action
  createSession() {
    this.collaborativeService.send("create_meeting");
  }


  @action
  jumpToPerspective(user: string) {
    this.collaborativeService.send(CollaborativeEvents.GetPerspective, {target: user});
  }

  @action
  giveControl(user: string) {
    this.collaborativeService.send(CollaborativeEvents.UserInControl, { user: user });
  }

  @action
  receiveUserJoined(data: UserJoinedMessage) {
    AlertifyHandler.showAlertifyMessage(data.user + " joined!");
  }
}
