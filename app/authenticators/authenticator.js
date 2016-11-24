import Ember from 'ember';

import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({

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
        console.log("hi from authenticate");
        return this.get('ajax').raw("http://localhost:8080/sessions/create", {
            method: 'POST',
            data: {
             username: options.identification,
             password: options.password
         }
     });
    },

    invalidate: function() {
        console.log('invalidate...');
        return Ember.RSVP.resolve();
    }
});


       // .then({ response } => this.handleSuccess(response))
       // .catch(({ response, jqXHR }) => this.handleError(response))