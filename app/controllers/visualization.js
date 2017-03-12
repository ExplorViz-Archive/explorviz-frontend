import Ember from 'ember';

export default Ember.Controller.extend({

  queryParams: ['timestamp', 'id', 'appName'],

  type: 'landscape',
  id: null,
  appName: null,

  showLandscape: true,
  lastShownApplication: null,

  landscapeUpdater: Ember.inject.service("landscape-reload"),
  landscape: Ember.computed.oneWay("landscapeUpdater.object"),
  
  //the observer reacts to changes for the computed value landscape
  observer: Ember.observer("landscape", function(){
    this.debug("hello");
  })

});