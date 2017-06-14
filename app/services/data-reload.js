import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service('store'),
	object:null,
	session: Ember.inject.service("session"),
	isAuthenticated: Ember.computed.oneWay("session.isAuthenticated"),
	previousRequestDone: true,
	updateThread: null, // This thread shall update the most actual object
	reloadThread: null, //This thread shall reload other objects
	shallReload: false, // This attribute defines, if and when we wnat reload data
	shallUpdate: false,

	// @Override
	init(){
		this._super(...arguments);

		//starts the observer, because of "get"
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
			this.set("updateThread", Ember.run.later(this, function(){this.updateLoop();}, (10*1000)));
			console.log(this.get("updateThread").run);
		}
	},
	
	// This function is the part, which has to be overwritten by extending services (e.g. landscape-reload) 
	updateObject(){
		// e.g. object = this.store.queryRecord('landscape', 'latest-landscape');
	},
	
	
	//The update also starts with the reloading if shallBeReloaded is true
	startUpdate: function(){
			if(!this.get("updateThread")){
				this.set('shallUpdate', true);
				this.updateObject();
				this.set("updateThread", Ember.run.later(this, this.updateLoop, (10*1000)));
			}
			this.startReload();
	}.observes("isAuthenticated"),
	
	stopUpdate: function(){
		this.set("shallUpdate", false);
		Ember.run.cancel(this.get("updateThread"));
		this.set("updateThread", null);
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
