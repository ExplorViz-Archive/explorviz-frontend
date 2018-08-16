import { inject as service } from "@ember/service";
import { isEmpty } from '@ember/utils';
import RSVP, { resolve, reject } from 'rsvp';
import Base from 'ember-simple-auth/authenticators/base';
import config from 'explorviz-frontend/config/environment';

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
export default Base.extend({

  session: service(),
  store: service(),
  ajax: service(),

  // @Override
  /**
   * TODO
   *
   * @method restore
   */
  restore(data) {
    return new RSVP.Promise(function(resolve, reject) {
        if (!isEmpty(data.access_token)) {
            resolve(data);
        } else {
            reject();
        }
    });
  },


  // @Override
  /**
   * TODO
   *
   * @method authenticate
   */
  authenticate(user) {
    this.set('session.session.messages', {});

    const url = config.APP.API_ROOT;

    return this.get('ajax').request(`${url}/v1/tokens/`, {
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: {
        username: user.identification,
        password: user.password
      }
    }).then(fulfill, failure);

    function fulfill(token) {
      return resolve({
        access_token: token,
        username: user.identification
      });
    }

    function failure(reason) {
      return reject(reason);
    }

  },


  // @Override
  /**
   * TODO
   *
   * @method invalidate
   */
  invalidate(data, args) {
    if(args && Object.keys(args)[0]) {
      const key = Object.keys(args)[0];

      if(!this.get('session.session.messages')) {
        this.set('session.session.messages', {});
      }

      this.set('session.session.messages.' + key, args[key]);
    }
    return RSVP.resolve();
  }

});