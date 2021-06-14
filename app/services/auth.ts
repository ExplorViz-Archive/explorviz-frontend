import Service, { inject as service } from '@ember/service';
import config from 'explorviz-frontend/config/environment';
import { Auth0Error, Auth0UserProfile } from 'auth0-js';
import Auth0Lock from 'auth0-lock';
import debugLogger from 'ember-debug-logger';

export default class Auth extends Service {
  private debug = debugLogger();

  @service('router')
  router!: any;

  // is initialized in the init()
  private lock: Auth0LockStatic | null = null;

  user: Auth0UserProfile | undefined = undefined;

  accessToken: string | undefined = undefined;

  constructor() {
    super(...arguments);

    if (config.environment === 'noauth') { // no-auth
      this.set('user', config.auth0.profile);
      this.set('accessToken', config.auth0.accessToken);
      return;
    }

    this.lock = new Auth0Lock(
      config.auth0.clientId,
      config.auth0.domain,
      {
        auth: {
          redirectUrl: config.auth0.callbackUrl,
          audience: `https://${config.auth0.domain}/api/v2/`,
          responseType: 'token',
          params: {
            scope: 'openid profile',
          },
          autoParseHash: true,
        },
        container: 'auth0-login-container',
        theme: {
          logo: config.auth0.logoUrl,
        },
        closable: false,
        languageDictionary: {
          title: 'ExplorViz',
        },
      },
    );

    this.lock.on('authenticated', (authResult) => {
      this.router.transitionTo(config.auth0.routeAfterLogin).then(async () => {
        await this.setUser(authResult.accessToken);
        this.set('accessToken', authResult.accessToken);
      });
    });
  }

  /**
   * Send a user over to the hosted auth0 login page
   */
  login() {
    // Since testem seems to enter routes but not render their templates,
    // the login container does not necessarily exist, which results in an error
    if (!document.getElementById('auth0-login-container')) {
      return;
    }

    if (this.lock) {
      this.lock.show();
    } else { // no-auth
      this.router.transitionTo(config.auth0.routeAfterLogin);
    }
  }

  /**
   * Use the token to set our user
   */
  setUser(token: string) {
    // once we have a token, we are able to go get the users information
    return new Promise<Auth0UserProfile>((resolve, reject) => {
      if (this.lock) {
        this.lock.getUserInfo(token, (_err: Auth0Error, profile: Auth0UserProfile) => {
          if (_err) {
            reject(_err);
          } else {
            this.debug('User set', profile);
            this.set('user', profile);
            resolve(profile);
          }
        });
      } else { // no-auth
        this.set('user', config.auth0.profile);
        resolve(config.auth0.profile);
      }
    });
  }

  /**
   * Check if we are authenticated using the auth0 library's checkSession
   */
  checkLogin() {
    // check to see if a user is authenticated, we'll get a token back
    return new Promise((resolve, reject) => {
      if (this.lock) {
        this.lock.checkSession({}, async (err, authResult) => {
          this.debug(authResult);
          if (err || authResult === undefined) {
            reject(err);
          } else {
            try {
              await this.setUser(authResult.accessToken);
              this.set('accessToken', authResult.accessToken);
              resolve(authResult);
            } catch (e) {
              reject(e);
            }
          }
        });
      } else { // no-auth
        this.set('user', config.auth0.profile);
        this.set('accessToken', config.auth0.accessToken);
        resolve({});
      }
    });
  }

  /**
   * Get rid of everything in sessionStorage that identifies this user
   */
  logout() {
    this.set('user', undefined);
    this.set('accessToken', undefined);
    if (this.lock) {
      this.lock.logout({
        clientID: config.auth0.clientId,
        returnTo: config.auth0.logoutReturnUrl,
      });
    } else { // no-auth
      this.router.transitionTo('/');
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'auth': Auth;
  }
}
