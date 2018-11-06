import { inject as service } from "@ember/service";
import Component from '@ember/component';
import debugLogger from 'ember-debug-logger';

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

  debug: debugLogger(),

  session: service(),
  router: service('-routing'),
  store: service(),

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

        self.debug(reason);

        const backendResponse = reason.errors[0];        

        let errorMessage = "No connection to backend";

        if (backendResponse && backendResponse.status && backendResponse.title &&
          backendResponse.detail) {

          errorMessage = `${backendResponse.status}: ${backendResponse.title} / 
            ${backendResponse.detail}`;

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