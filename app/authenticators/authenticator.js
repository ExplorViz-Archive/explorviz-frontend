import Ember from 'ember';

import Base from 'ember-simple-auth/authenticators/base';
import ENV from 'explorviz-ui-frontend/config/environment';

const {inject, RSVP, $, isEmpty, run} = Ember;

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

  session: inject.service(),

  tokenEndpoint: ENV.APP.API_ROOT,

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
  authenticate(identification, password) {
    this.set('session.session.messages', {});
    return new RSVP.Promise((resolve, reject) => {
        $.ajax({
            url: this.tokenEndpoint + '/sessions/create',
            type: 'POST',
            data: "username=" + identification + "&password=" + password,
            accept: "application/json"
        }).then(function(response) {
            run(function() {              
              resolve({
                  access_token: response.token,
                  username: response.username
              });
            });
        }, function(xhr) {
            let httpResponse = xhr;
            run(function() {
                reject(httpResponse);
            });
        });
    });
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