import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  username: Ember.computed(function(){
    var that = this;
    return this.get('session').session.content.authenticated.username;
  })

});
