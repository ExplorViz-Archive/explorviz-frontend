import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class EventSettingsService extends Service.extend({
  // anything which *must* be merged to prototype here
}) {

  @tracked
  mouseMove: boolean = true;

  @tracked
  mouseStop: boolean = true;
  
  @tracked
  mouseOut: boolean = true;

  @tracked
  mouseHover: boolean = true;

  @tracked
  singleClick: boolean = true;

  @tracked
  doubleClick: boolean = true;

  @tracked
  perspective: boolean = true;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'event-settings-service': EventSettingsService;
  }
}
