import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
import { run } from '@ember/runloop'; 

/**
 * This service is used like an abstract service. It only works with an 
 * "authenticated session". It will start immediatly working, when the session 
 * is authenticated.
 *
 * @class Data-Reload-Service
 * @extends Ember.Service
 */

export default Service.extend({

  store: service(),
  session: service(),


  /**
  * Latest fetched entity 
  *
  * @property object
  * @type Object
  */
  object:null,
  

  /**
  * TODO 
  *
  * @property isAuthenticated
  * @type Boolean
  */
  isAuthenticated: computed.oneWay("session.isAuthenticated"),


  /**
  * This thread shall fetch the most actual object 
  *
  * @property fetchThread
  * @type "Timer information for use in canceling, see `Ember.run.cancel`"
  */
  fetchThread: null,


  /**
  * This thread shall reload other already fetched objects. 
  *
  * @property reloadThread
  * @type "Timer information for use in canceling, see `Ember.run.cancel`"
  */
  reloadThread: null,


  /**
  * Flag for enabling/disabling reloading
  *
  * @property shallReload
  * @type Boolean
  */
  shallReload: false,


  /**
  * Flag for enabling/disabling updating
  *
  * @property shallReload
  * @type Boolean
  */
  shallUpdate: false,


  // @Override
  /**
   * TODO
   *
   * @method init
   */
  init(){
    this._super(...arguments);

    // Starts the observer, because of "get"
    this.get("isAuthenticated");
  },

  
  /**
   * This loop works infinetly, unless the session is authenticated.
   *
   * @method authenticate
   */
  updateLoop: function(){
    if(this.get("isAuthenticated") === true && this.get("shallUpdate")){
      this.updateObject();
      this.set("fetchThread", 
        run.later(this, function(){this.updateLoop();}, (10*1000)));
    }
  },


  /**
   * This function is the part, which has to be overwritten by extending 
   * services (e.g. landscape-reload)
   *
   * @method updateObject
   */ 
  updateObject(){
    // e.g. object = this.store.queryRecord('landscape', 'latest-landscape');
  },
  
  
  /**
   * The update also starts with the reloading if shallBeReloaded is true
   *
   * @method startUpdate
   */ 
  startUpdate: observer("isAuthenticated", function() {
      if(!this.get("fetchThread")){
        this.set('shallUpdate', true);
        this.updateObject();
        this.set("fetchThread", 
          run.later(this, this.updateLoop, (10*1000)));
      }
      this.startReload();
  }),

  
  /**
   * TODO
   *
   * @method stopUpdate
   */ 
  stopUpdate: function(){
    this.set("shallUpdate", false);
    run.cancel(this.get("fetchThread"));
    this.set("fetchThread", null);
  },
  
  
  /**
   * TODO
   *
   * @method startReload
   */
  startReload: function(){
    run.cancel(this.get("reloadThread"));
    this.set("shallReload", true);
    // disabled at the moment, since it introduces backend bugs
    //this.set("reloadThread", run.later(this, this.reloadObjects, 100));
  
  },


  /**
   * TODO
   *
   * @method stopReload
   */   
  stopReload: function(){
    this.set("shallReload", false);
    run.cancel(this.get("reloadThread"));
    this.set("reloadThread", null);
  },  
  

  /**
   * This function has to be overwritten
   *
   * @method reloadObjects
   */   
  reloadObjects(){}
  
});
