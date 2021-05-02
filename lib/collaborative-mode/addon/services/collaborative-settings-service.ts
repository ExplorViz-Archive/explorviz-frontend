import { A } from '@ember/array';
import { action } from '@ember/object';
import Service, { inject as service } from '@ember/service';

import { tracked } from '@glimmer/tracking';
import config from 'explorviz-frontend/config/environment';
import CollaborativeService from 'collaborative-mode/services/collaborative-service';
import { Meeting } from 'collaborative-mode/utils/collaborative-data';
import Auth from 'explorviz-frontend/services/auth';

export default class CollaborativeSettingsService extends Service {
  @service('collaborative-service')
  collaborativeService!: CollaborativeService;

  @service('auth')
  auth!: Auth;

  constructor() {
    super(...arguments);
    this.collaborativeService.on('meeting_created', this.onMeetingCreated);
    this.collaborativeService.on('meeting_updated', this.onMeetingUpdated);
    this.collaborativeService.on('meeting_list', this.onMeetingList);
  }

  meetings: String[] = A([]);

  @tracked
  meeting?: Meeting;

  @tracked
  connected: boolean = false;

  randomUsername = `User${Math.floor(Math.random() * Math.floor(100))}`;

  get username(): string {
    if (config.environment === 'noauth') { // no-auth
      return this.randomUsername;
    }
    return this.auth.user?.name || '';
  }

  get presentationMode(): boolean {
    if (this.meeting) {
      return this.meeting.presentationMode;
    }
    return false;
  }

  get amIAdmin(): boolean {
    return this.meeting?.adminId === this.username;
  }

  get userInControl() {
    return this.meeting?.presenterId;
  }

  get isInteractionAllowed(): boolean {
    return !this.meeting || !this.presentationMode || this.userInControl === this.username;
  }

  get canIOpen(): boolean {
    return !this.meeting || this.amIInControl;
  }

  get amIInControl(): boolean {
    return this.username === this.userInControl;
  }

  get amIPresenter(): boolean {
    return this.presentationMode && this.amIInControl;
  }

  get amIViewer(): boolean {
    return this.presentationMode && !this.amIInControl;
  }

  get watching(): boolean {
    return this.presentationMode && this.meeting?.presenterId !== this.username;
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
