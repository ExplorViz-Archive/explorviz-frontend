import Ember from 'ember';

import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({

    session: Ember.inject.service(),

    ajax: Ember.inject.service(),

    tokenEndpoint: 'http://localhost:8080/sessions/create',

    restore: function(data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (!Ember.isEmpty(data.token)) {
                resolve(data);
            } else {
                reject();
            }
        });
    },

    authenticate: function(options) {
        return this.get('ajax').raw(this.get('tokenEndpoint'), {
            method: 'POST',
            data: "username=admin&password=explorVizPass",
            //contentType: "application/json",
            accept: "application/json"         
        })
        .then((response) => this.handleSuccess(response))
        .catch((response, jqXHR) => this.handleError(response));
    },

    handleSuccess: function(responseObj) {
        this.set('session.data.authenticated.token', responseObj.response["token"]);
        console.log(this.get('session.data'));
    },

    handleError: function(error) {
        console.log(error);
    },

    invalidate: function() {
        console.log('invalidate...');
        return Ember.RSVP.resolve();
    }
});

       // JSON.stringify({ username: options.identification, 
       //         password: options.password })
       // .then({ response } => this.handleSuccess(response))
       // .catch(({ response, jqXHR }) => this.handleError(response))