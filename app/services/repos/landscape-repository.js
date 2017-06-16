import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  latestLandscape: null,

  observer: Ember.observer("latestLandscape.timestamp", function(){
    this.trigger("updated", this.get("latestLandscape"));
  }),

});
