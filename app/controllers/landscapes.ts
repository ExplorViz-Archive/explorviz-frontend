import Controller from '@ember/controller';
import { action } from '@ember/object';
import LandscapeTokenService, { LandscapeToken } from 'explorviz-frontend/services/landscape-token';
import { inject as service } from '@ember/service';

export default class Landscapes extends Controller {
  @service('landscape-token')
  tokenService!: LandscapeTokenService;

  @action
  selectToken(token: LandscapeToken) {
    this.tokenService.setToken(token);
    this.transitionToRoute('visualization');
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'landscapes': Landscapes;
  }
}
