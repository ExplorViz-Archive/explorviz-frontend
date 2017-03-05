import Ember from 'ember';

export default Ember.Controller.extend({

  queryParams: ['lid'],
  lid: null,

  showLandscape: true,
  
  computeLandscapeID: Ember.computed('lid', 'model', function() {
    var lid = this.get('lid');
    //var currentLandscape = this.get('model');
    if(lid) {
      // query for this lid
      return "test1";
    } else {
      // use lid of currentLandscape
      return "test2";
    }
    

  })

});
