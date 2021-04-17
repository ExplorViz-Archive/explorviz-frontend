import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import CollaborativeSettingsService from 'explorviz-frontend/services/collaborative-settings-service';
import EventSettingsService from 'explorviz-frontend/services/event-settings-service';

interface EventSettingsArgs { }

export default class EventSettings extends Component<EventSettingsArgs> {
  @tracked
  collapsed: boolean = true;

  @service('collaborative-settings-service')
  collaborativeSettings!: CollaborativeSettingsService;

  @service('event-settings-service')
  eventSettings!: EventSettingsService;

  get settings() {
    return [
      {
        name: 'Follow Camera?',
        tooltip: 'Follow camera movement',
        value: this.eventSettings.perspective,
        onToggle: this.togglePerspective,
      },
      {
        name: 'Mouse move?',
        tooltip: 'Show mouse movement of others',
        value: this.eventSettings.mouseMove,
        onToggle: this.toggleMouseMove,
      },
      {
        name: 'Mouse stop?',
        tooltip: 'Show tooltips.',
        value: this.eventSettings.mouseStop,
        onToggle: this.toggleMouseStop,
      },
      {
        name: 'Mouse hover?',
        tooltip: 'Show highlighted objects',
        value: this.eventSettings.mouseHover,
        onToggle: this.toggleMouseHover,
      },
      {
        name: 'Single Click?',
        tooltip: 'Follow single clicks',
        value: this.eventSettings.singleClick,
        onToggle: this.toggleSingleClick,
      },
      {
        name: 'Double Click?',
        tooltip: 'Follow Double clicks',
        value: this.eventSettings.doubleClick,
        onToggle: this.toggleDoubleClick,
      },
    ];
  }

  @action
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  @action
  togglePerspective() {
    this.eventSettings.perspective = !this.eventSettings.perspective;
  }

  @action
  toggleMouseMove() {
    this.eventSettings.mouseMove = !this.eventSettings.mouseMove;
  }

  @action
  toggleMouseStop() {
    this.eventSettings.mouseStop = !this.eventSettings.mouseStop;
  }

  @action
  toggleMouseHover() {
    this.eventSettings.mouseHover = !this.eventSettings.mouseHover;
  }

  @action
  toggleSingleClick() {
    this.eventSettings.singleClick = !this.eventSettings.singleClick;
  }

  @action
  toggleDoubleClick() {
    this.eventSettings.doubleClick = !this.eventSettings.doubleClick;
  }
}
