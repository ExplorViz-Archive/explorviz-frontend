import Ember from 'ember';

import Base from 'ember-simple-auth/authenticators/base';
import ENV from 'explorviz-ui-frontend/config/environment';

/**
Custom authenticator for token based authentication.

@author akr
@class Authenticator
@extends ember-simple-auth/authenticators/base
*/
export default Base.extend({

  session: Ember.inject.service(),
  ajax: Ember.inject.service(),

  tokenEndpoint: ENV.APP.API_ROOT,

  restore(data) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        if (!Ember.isEmpty(data.access_token)) {
            resolve(data);
        } else {
            reject();
        }
    });
  },


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
            let response = xhr.responseText;           
            Ember.run(function() {
                reject(response);
            });
        });
    });
  },

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

// JSON.stringify({ username: options.identification,
//         password: options.password })
// .then({ response } => this.handleSuccess(response))
// .catch(({ response, jqXHR }) => this.handleError(response))
