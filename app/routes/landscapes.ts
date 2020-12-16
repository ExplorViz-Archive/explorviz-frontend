import { inject as service } from '@ember/service';
import LandscapeTokenService, { LandscapeToken } from 'explorviz-frontend/services/landscape-token';

import BaseRoute from './base-route';

export default class Landscapes extends BaseRoute {
  @service('landscape-token')
  tokenService!: LandscapeTokenService;

  model() {
    const uId = this.auth.user?.sub;

    if (!uId) {
      return Promise.reject(new Error('User profile not set'));
    }

    return new Promise<any>((resolve, reject) => {
      fetch(`http://localhost:32682/user/${uId}/token`, {
        headers: {
          Authorization: `Bearer ${this.auth.accessToken}`,
        },
      })
        .then(async (response: Response) => {
          if (response.ok) {
            const tokens = await response.json() as LandscapeToken[];
            resolve(tokens);
          } else {
            reject();
          }
        })
        .catch((e) => reject(e));
    });
  }

  afterModel(landscapeTokens: LandscapeToken[]) {
    const currentToken = this.tokenService.token;
    if (currentToken !== null && !landscapeTokens.includes(currentToken)) {
      this.tokenService.removeToken();
    }
  }
}
