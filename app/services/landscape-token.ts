/* eslint-disable class-methods-use-this */
import Service from '@ember/service';

export type LandscapeToken = {
  id: string,
  alias: string|undefined,
  creationDate: string,
  lastUpdated: string,
};

export default class LandscapeTokenService extends Service {
  token: LandscapeToken|null = null;

  init() {
    super.init();

    this.restoreToken();
  }

  restoreToken() {
    const currentLandscapeTokenJSON = localStorage.getItem('currentLandscapeToken');

    if (currentLandscapeTokenJSON === null) {
      this.set('token', null);
      return;
    }

    const parsedToken = JSON.parse(currentLandscapeTokenJSON);

    if (this.isValidToken(parsedToken)) {
      this.set('token', parsedToken);
    } else {
      this.removeToken();
    }
  }

  setToken(token: LandscapeToken) {
    localStorage.setItem('currentLandscapeToken', JSON.stringify(token));
    this.set('token', token);
  }

  removeToken() {
    localStorage.removeItem('currentLandscapeToken');
    this.set('token', null);
  }

  private isValidToken(token: unknown): token is LandscapeToken {
    return (this.isObject(token)
      && Object.keys(token).length === 4
      && {}.hasOwnProperty.call(token, 'id')
      && {}.hasOwnProperty.call(token, 'alias')
      && {}.hasOwnProperty.call(token, 'creationDate')
      && {}.hasOwnProperty.call(token, 'lastUpdated')
      && typeof (<LandscapeToken>token).id === 'string'
      && (typeof (<LandscapeToken>token).alias === 'string' || typeof (<LandscapeToken>token).alias === 'undefined')
      && typeof (<LandscapeToken>token).creationDate === 'string'
      && typeof (<LandscapeToken>token).lastUpdated === 'string');
  }

  private isObject(variable: unknown): variable is object {
    return Object.prototype.toString.call(variable) === '[object Object]';
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'landscape-token': LandscapeTokenService;
  }
}
