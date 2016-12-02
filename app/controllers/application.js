import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  username: Ember.computed(function(){
    return this.get('session').session.content.authenticated.username;
  })

});
