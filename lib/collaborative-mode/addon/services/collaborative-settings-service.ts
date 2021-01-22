import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CollaborativeSettingsService extends Service.extend({
  // anything which *must* be merged to prototype here
}) {

  color: string = "green";

  @tracked
  enabled: boolean = false;

  @tracked
  perspective: boolean = true;

  @tracked
  mouseMove: boolean = true;

  @tracked
  mouseStop: boolean = true;

  @tracked
  mouseHover: boolean = true;

  @tracked
  singleClick: boolean = true;

  @tracked
  doubleClick: boolean = true;

}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'collaborative-settings-service': CollaborativeSettingsService;
  }
}
