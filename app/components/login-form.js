import Ember from 'ember';

export default Ember.Component.extend({

  session: Ember.inject.service('session'),
  router: Ember.inject.service('-routing'),

  actions: {
    authenticate() {
      const { identification, password } = 
        this.getProperties('identification', 'password');

      this.get('session')
        .authenticate('authenticator:authenticator', identification, password)
        .catch((reason) => {

          const errorMessage = (reason && reason.error) ? reason.error : 
           "No connection to Backend";

          this.set('session.session.messages.errorMessage', errorMessage);
        });
    }
  }

});