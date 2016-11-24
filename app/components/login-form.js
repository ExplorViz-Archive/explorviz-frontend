import Ember from 'ember';

export default Ember.Component.extend({

  authenticator: 'authenticator:authenticator',

  session: Ember.inject.service('session'),

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate(this.get('authenticator'), identification, password).catch((reason) => {
        this.set('errorMessage', reason || reason.error);
      });
    }
  }
});