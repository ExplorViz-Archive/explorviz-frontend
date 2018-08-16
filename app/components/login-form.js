import { inject as service } from "@ember/service";
import Component from '@ember/component';

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

  session: service('session'),
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
      if(this.get('session.session') && this.get('session.session.messages')) {
        this.set('session.session.messages.message',"");
        this.set('session.session.messages.errorMessage',"");
      }

      if(!this.checkForValidInput(user)) {
        const errorMessage = "Enter valid credentials.";
        this.set('session.session.messages.errorMessage', errorMessage);
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

        self.set('session.session.messages.errorMessage', errorMessage);

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