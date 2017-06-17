import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  latestTimestamps: null,

  observer: Ember.observer("latestTimestamps", function(){
    this.trigger("updated");
  }),

});
