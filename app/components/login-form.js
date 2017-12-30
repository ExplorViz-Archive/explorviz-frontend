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

      const { identification, password } = 
        this.getProperties('identification', 'password');

      // reset (possible) old lables
      if(this.get('session.session') && this.get('session.session.messages')) {
        this.set('session.session.messages.message',"");
        this.set('session.session.messages.errorMessage',"");
      }

      if(!this.checkForValidInput(identification, password)) {
        const errorMessage = "Enter valid credentials.";
        this.set('session.session.messages.errorMessage', errorMessage);
        return;
      }

      // retrieve empty user record from backend with valid id
      this.get('store').queryRecord('user', {
        username: identification
      }).then(success, failure);

      function success(userRecord) {
        userRecord.set('username', identification);
        userRecord.set('password', password);
        self.get('session').authenticate('authenticator:authenticator', userRecord).then(undefined, failure);
      }

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

  checkForValidInput(username, password) {
    const usernameValid = username !== "" && username !== null && 
      username !== undefined;

    const passwordValid = password !== "" && password !== null && 
      password !== undefined;

    return usernameValid && passwordValid;
  }

});