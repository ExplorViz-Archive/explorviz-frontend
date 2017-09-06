import Ember from 'ember';

import Base from 'ember-simple-auth/authenticators/base';
import ENV from 'explorviz-ui-frontend/config/environment';

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
* @extends Base
*/
export default Base.extend({

  session: Ember.inject.service(),
  ajax: Ember.inject.service(),

  tokenEndpoint: ENV.APP.API_ROOT,

  // @Override
  /**
   * TODO
   *
   * @method restore
   */
  restore(data) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        if (!Ember.isEmpty(data.access_token)) {
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
    return new Ember.RSVP.Promise((resolve, reject) => {
        Ember.$.ajax({
            url: this.tokenEndpoint + '/sessions/create',
            type: 'POST',
            data: "username=" + identification + "&password=" + password,
            accept: "application/json"
        }).then(function(response) {
            Ember.run(function() {              
              resolve({
                  access_token: response.token,
                  username: response.username
              });
            });
        }, function(xhr) {
            let httpResponse = xhr;
            Ember.run(function() {
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
    return Ember.RSVP.resolve();
  }

});