import Ember from 'ember';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),
  visualization: Ember.inject.controller(),

  actions: {
    resetToLandscapeView() {
      this.set('visualization.showLandscape', true);
    } 
  },

  username: Ember.computed(function(){
    return this.get('session').session.content.authenticated.username;
  })

});