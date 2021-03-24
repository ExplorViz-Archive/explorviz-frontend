import Service from '@ember/service';
import { inject as service } from '@ember/service';
import CollaborativeSettingsService from 'explorviz-frontend/services/collaborative-settings-service';

export default class PermissionService extends Service.extend({
  // anything which *must* be merged to prototype here
}) {

  @service('collaborative-settings-service')
  settings!: CollaborativeSettingsService;

  get canInteract() {
    return 
  }

  get readSingleClicks() {
    return this.settings.singleClick || this.settings.watching
  }


  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'permission-service': PermissionService;
  }
}
