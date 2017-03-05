import Ember from 'ember';

export default Ember.Controller.extend({

  queryParams: ['lid'],
  lid: null,

  computeLandscapeID: Ember.computed('lid', 'model', function() {
    var lid = this.get('lid');
    var currentLandscape = this.get('model');
    if(lid) {
      // query for this lid
      return "test1";
    } else {
      // use lid of currentLandscape
      return "test2";
    }
    

  }),

  actions: {
    test(data) {
      console.log("hello from action", data);
    }
  },

  showApplication: Ember.computed('showApplication', function() {
    if (this.get('visualizationToShow') === 'application') {
      return true;
    } else if (this.get('visualizationToShow') === 'landscape') {
      return true;
    }
  })

});
