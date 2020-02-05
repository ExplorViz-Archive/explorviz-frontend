import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';
import config from 'explorviz-frontend/config/environment';
import DS from 'ember-data';
import { AjaxServiceClass } from 'ember-ajax/services/ajax';
import { set, get } from '@ember/object';
import User from 'explorviz-frontend/models/user';
// @ts-ignore
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

/**
* This Authenticator sends a single AJAX request with data fields "username"
* and "password" to the backend. The backend checks the authentication data
* and responds with a randomized token, if authentication was successful. This
* token is now used for all future requests by the
* {{#crossLink "Authorizer"}}{{/crossLink}}, since all backend resources are
* secured by token-based authorization.
* {{#crossLink "Authenticator/authenticate:method"}}{{/crossLink}} is called by
* {{#crossLink "Login-Form/authenticate:method"}}{{/crossLink}}.
*
* @class Authenticator
* @extends Ember-Simple-Auth.Authenticators.BaseAuthenticator
*
* @module explorviz
* @submodule security
*/
export default class Authenticator extends BaseAuthenticator {
  @service('session') session!: any;

  @service('store') store!: DS.Store;

  @service('ajax') ajax!: AjaxServiceClass;

  // @Override
  /**
   * TODO
   *
   * @method restore
   */
  restore(data: any) {
    const self = this;
    const url = config.APP.API_ROOT;

    // TODO refactor with Ember-Data

    return new RSVP.Promise((resolve, reject) => {
      function fulfill(newTokenPayload: any) {
        const userRecord: User = self.store.push(data.rawUserData) as User;
        set(userRecord, 'token', newTokenPayload.token);
        resolve({
          access_token: newTokenPayload.token,
          user: userRecord,
          rawUserData: data.rawUserData,
        });
      }

      function failure(answer: any) {
        let reason = 'Please login again.';

        try {
          reason = answer.payload.errors[0].detail;
        } catch (exception) {
          // self.debug("During authentication refreshment, the following error was reported
          // , exception);
        }
        set(self.session, 'errorMessage', reason);
        reject(reason);
      }

      if (!isEmpty(data.access_token)) {
        // check if token is still valid
        self.ajax.request(`${url}/v1/tokens/refresh`, {
          method: 'POST',
          contentType: 'application/json;',
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }).then(fulfill, failure);
      } else {
        reject();
      }
    });
  }


  // @Override
  /**
   * TODO
   *
   * @method authenticate
   */
  authenticate(user: {identification: string, password: string}) {
    const url = config.APP.API_ROOT;

    const self = this;

    function fulfill(userPayload: any) {
      const userRecord = self.store.push(userPayload) as User;
      return RSVP.resolve({
        // rawUserData is necessary, because the userRecord is transformed
        // to typical JSON on page refresh (see "restore" above)
        access_token: get(userRecord, 'token'),
        user: userRecord,
        rawUserData: userPayload,
      });
    }

    function failure(reason: any) {
      return RSVP.reject(reason);
    }

    // TODO refactor with Ember-Data

    return this.ajax.request(`${url}/v1/tokens`, {
      method: 'POST',
      contentType: 'application/json;',
      data: {
        username: user.identification,
        password: user.password,
      },
    }).then(fulfill, failure);
  }


  // @Override
  /**
   * TODO
   *
   * @method invalidate
   */
  invalidate(_data: any, args: any) {
    set(this.session.session.content, 'message', args.message);
    return RSVP.resolve();
  }
}
