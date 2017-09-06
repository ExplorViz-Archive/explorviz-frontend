import Ember from 'ember';

const {Component, inject} = Ember;

/**
* TODO
* 
* @class Login-Form
* @extends Ember.Component
*/

export default Component.extend({

  session: inject.service('session'),
  router: inject.service('-routing'),

  actions: {

    /**
     * TODO
     *
     * @method authenticate
     */
    authenticate() {

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

      // try to authenticate (see authenticator.js)
      this.get('session')
        .authenticate('authenticator:authenticator', identification, password)
        .catch((reason) => {

          // Fallback message
          let errorMessage = "No connection to Backend";

          // Message from backend
          if (reason && reason.status) {
            errorMessage = `${reason.status}: ${reason.statusText} / 
              ${reason.responseText}`;
          }

          this.set('session.session.messages.errorMessage', errorMessage);
        });
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