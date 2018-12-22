import { inject as service } from "@ember/service";
import Component from '@ember/component';
import debugLogger from 'ember-debug-logger';
import $ from 'jquery';

/**
* TODO
* 
* @class Login-Form-Component
* @extends Ember.Component
*
* @module explorviz
* @submodule page
*/
export default Component.extend({

  // No Ember generated container
  tagName: '',

  debug: debugLogger(),

  session: service(),
  router: service('-routing'),
  store: service(),

  didInsertElement(){
    this._super(...arguments);
    // also support autofocus for firefox
    $('#username').focus();
  },

  actions: {

    /**
     * TODO
     *
     * @method authenticate
     */
    authenticate() {

      const self = this;

      const user = this.getProperties('identification', 'password');

      // reset (possible) old lables
      try {
        this.set('session.session.content.message', "");
        this.set('session.session.content.errorMessage', "");
      } catch(exception) {
        this.debug("Error when resetting login page labels", exception);
      }


      if(!this.checkForValidInput(user)) {
        const errorMessage = "Enter valid credentials.";
        this.set('session.session.content.errorMessage', errorMessage);
        return;
      }

      this.get('session').authenticate('authenticator:authenticator', user).then(undefined, failure);

      function failure(reason) {

        let errorMessage = "No connection to backend";

        // NULL if no connection to backend
        if(reason.payload) {

          if(reason.payload.errors && reason.payload.errors[0]) {

            const errorPayload = reason.payload.errors[0];

            if (errorPayload && errorPayload.status && errorPayload.title && errorPayload.detail) {

              self.debug(errorPayload.detail);

              errorMessage = `${errorPayload.status}: ${errorPayload.title} / ${errorPayload.detail}`;
            }

          }          
        }
        self.set('session.session.content.errorMessage', errorMessage);
      }

    }

  },

  checkForValidInput(user) {

    const username = user.identification;
    const password = user.password;

    const usernameValid = username !== "" && username !== null && 
      username !== undefined;

    const passwordValid = password !== "" && password !== null && 
      password !== undefined;

    return usernameValid && passwordValid;
  }

});