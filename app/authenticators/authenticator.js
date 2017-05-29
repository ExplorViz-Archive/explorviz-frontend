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

    //tokenEndpoint: 'http://192.168.247.129:8081',
    tokenEndpoint: ENV.APP.API_ROOT,

    restore: function(data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (!Ember.isEmpty(data.access_token)) {
                resolve(data);
            } else {
                reject();
            }
        });
    },


    authenticate: function(identification, password) {
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

    invalidate: function() {
        return Ember.RSVP.resolve();
    }
});

       // JSON.stringify({ username: options.identification,
       //         password: options.password })
       // .then({ response } => this.handleSuccess(response))
       // .catch(({ response, jqXHR }) => this.handleError(response))
