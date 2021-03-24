import { A } from '@ember/array';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import CollaborativeService from 'collaborative-mode/services/collaborative-service';
import { CollaborativeEvents, Meeting } from 'collaborative-mode/utils/collaborative-data';

export default class CollaborativeSettingsService extends Service.extend({
  // anything which *must* be merged to prototype here
}) {

  @service('collaborative-service')
  collaborativeService!: CollaborativeService;

  constructor() {
    super(...arguments);
    this.collaborativeService.on("meeting_created", this.onMeetingCreated);
    this.collaborativeService.on("meeting_updated", this.onMeetingUpdated);
    this.collaborativeService.on("meeting_list", this.onMeetingList);
  }

  meetings: String[] = A([]);

  @tracked
  meeting?: Meeting;

  @tracked
  connected: boolean = false;

  @tracked
  username: string = "User" + Math.floor(Math.random() * Math.floor(100));

  get presentationMode(): boolean {
    if (this.meeting) {
      return this.meeting.presentationMode;
    }
    return false;
  }

  get amIAdmin(): boolean {
    return this.meeting?.adminId == this.username;
  }

  get userInControl() {
    return this.meeting?.presenterId
  }

  get isSessionIdEmpty() {
    return !this.meetingId
  }

  get isInteractionAllowed(): boolean {
    return !this.meeting || !this.presentationMode || this.userInControl == this.username;
  }

  get canIOpen(): boolean {
    return !this.meeting || this.amIInControl
  }

  get amIInControl(): boolean {
    return this.username == this.userInControl;
  }

  get amIPresenter(): boolean {
    return this.presentationMode && this.amIInControl;
  }

  get amIViewer(): boolean {
    return this.presentationMode && !this.amIInControl;
  }

  get watching(): boolean {
    return this.presentationMode && this.meeting?.presenterId == this.username 
  }

  get followSingleClick(): boolean {
    return this.singleClick || this.amIViewer;
  }

  get followDoubleClick(): boolean {
    return this.doubleClick || this.amIViewer;
  }

  get followMouseMove(): boolean {
    return this.mouseMove || this.amIViewer;
  }

  get followMouseStop(): boolean {
    return this.mouseStop || this.amIViewer;
  }

  get followMouseHover(): boolean {
    return this.mouseHover || this.amIViewer;
  }

  get followPerspective(): boolean {
    return this.perspective || this.amIViewer;
  }

  @action
  onMeetingCreated(data: any) {
    this.meeting = data.meeting;
  }

  @action
  onMeetingUpdated(data: any) {
    this.meeting = data.meeting;
  }

  @action
  onMeetingList(data: any) {
    this.meetings.clear();
    this.meetings.pushObjects(data.meetings);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'collaborative-settings-service': CollaborativeSettingsService;
  }
}
