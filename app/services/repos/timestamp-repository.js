import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  latestTimestamp: null,

  observer: Ember.observer("latestTimestamp", function(){
    this.trigger("updated", this.get("latestTimestamp"));
  }),

});
