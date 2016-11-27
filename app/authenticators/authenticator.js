import Ember from 'ember';

import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({

    session: Ember.inject.service(),

    ajax: Ember.inject.service(),

    tokenEndpoint: 'http://localhost:8080/sessions/create',

    restore: function(data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            console.log("data", data);
            if (!Ember.isEmpty(data.token)) {
                resolve(data);
            } else {
                reject();
            }
        });
    },


    authenticate: function() {
        return new Ember.RSVP.Promise((resolve, reject) => {
            Ember.$.ajax({
                url: this.tokenEndpoint,
                type: 'POST',
                data: "username=admin&password=explorVizPass",
                accept: "application/json"  
            }).then(function(response) {
                Ember.run(function() {
                    console.log("hi from resolve");
                    console.log("response.id_token", response);
                    resolve({
                        token: response.token
                    });
                });
            }, function(xhr) {
                var response = xhr.responseText;
                Ember.run(function() {
                    reject(response);
                });
            });
        });
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