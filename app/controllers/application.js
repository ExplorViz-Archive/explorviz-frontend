import Ember from 'ember';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),
  visualization: Ember.inject.controller(),  

  actions: {

    resetToLandscapeView() {
      this.set('visualization.showLandscape', true);
    },

    exportState() {
      if(this.get('currentRouteName') === 'visualization') {
        try {
          this.get('visualization').send('exportState');
        }
        catch(err) {
          this.debug("Error when exporting URL", err);
        }
      }      
    },


    resetView(){
      this.get('visualization').send('resetView');
    }
  },

  username: Ember.computed(function(){
    return this.get('session').session.content.authenticated.username;
  })

});