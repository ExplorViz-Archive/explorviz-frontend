import { inject as service } from "@ember/service";
import { isEmpty } from '@ember/utils';
import RSVP, { resolve, reject } from 'rsvp';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
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
export default BaseAuthenticator.extend({

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

    const self = this;
    const url = config.APP.API_ROOT;

    return new RSVP.Promise(function(resolve, reject) {
      function fulfill(token) {
        resolve({
          access_token: token,
          username: data.username
        });
      }
  
      function failure(answer) {
        let reason = "Please login again.";

        try {
          reason = answer.payload.errors[0].detail;
        } catch(exception) {
          //self.debug("During authentication refreshment, the following error was reported", exception);
        }
        self.set('session.errorMessage', reason);
        reject(reason);
      }

      if (!isEmpty(data.access_token)) {

        // check if token is still valid
        self.get('ajax').request(`${url}/v1/tokens/refresh/`, {
          method: 'POST',
          contentType: 'application/json; charset=utf-8',
          headers: {
            'Authorization': `Bearer ${data.access_token.token}`
          }
        }).then(fulfill, failure);

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
    this.set('session.session.content.message', args.message);
    return RSVP.resolve();
  }

});