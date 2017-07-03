import Ember from 'ember';

export default Ember.Service.extend({

  store: Ember.inject.service('store'),
  session: Ember.inject.service("session"),

  // Latest fetched entity 
  object:null,
  
  isAuthenticated: Ember.computed.oneWay("session.isAuthenticated"),

  // This thread shall fetch the most actual object
  fetchThread: null,

  // This thread shall reload other already fetched objects
  reloadThread: null,

  // Flag for enabling/disabling reloading
  shallReload: false,

  // Flag for enabling/disabling updating
  shallUpdate: false,



  // @Override
  init(){
    this._super(...arguments);

    // Starts the observer, because of "get"
    this.get("isAuthenticated");
  },

  
  /* this service is used like an abstract service
   * it only works with an "authenticated session". It will start immediatly 
   * working, when the session is authenticated 
   */
  
  
  //This loop works infinetly, unless the session is authenticated
  updateLoop: function(){
    if(this.get("isAuthenticated") === true && this.get("shallUpdate")){
      this.updateObject();
      this.set("fetchThread", 
        Ember.run.later(this, function(){this.updateLoop();}, (10*1000)));
    }
  },

  
  // This function is the part, which has to be overwritten by 
  // extending services (e.g. landscape-reload) 
  updateObject(){
    // e.g. object = this.store.queryRecord('landscape', 'latest-landscape');
  },
  
  
  //The update also starts with the reloading if shallBeReloaded is true
  startUpdate: function(){
      if(!this.get("fetchThread")){
        this.set('shallUpdate', true);
        this.updateObject();
        this.set("fetchThread", 
          Ember.run.later(this, this.updateLoop, (10*1000)));
      }
      this.startReload();
  }.observes("isAuthenticated"),

  
  stopUpdate: function(){
    this.set("shallUpdate", false);
    Ember.run.cancel(this.get("fetchThread"));
    this.set("fetchThread", null);
  },
  
  
  startReload: function(){
    Ember.run.cancel(this.get("reloadThread"));
    this.set("shallReload", true);
    this.set("reloadThread", Ember.run.later(this, this.reloadObjects, 100));
  
  },

  
  stopReload: function(){
    this.set("shallReload", false);
    Ember.run.cancel(this.get("reloadThread"));
    this.set("reloadThread", null);
  },  
  
  
  //This function has to be overwritten
  reloadObjects(){}
  
});
