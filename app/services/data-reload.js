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
	
	/* this service is used like an abstract service
	 * it only works with an "authenticated session". It will start immediatly 
 	 * working, when the session is authenticated 
	 */
	
	
	//This loop works infinetly, unless the session is authenticated
	updateLoop: function(){
		if(this.get("isAuthenticated") === true){
			this.updateObject();
			this.set("updateThread", Ember.run.later(this, function(){this.updateLoop();}, (10*1000)));
		}
	},
	
	//This function is the part, which has to be overwritten by extending services (e.g. landscape-reload) 
	updateObject(){
		// z.B. object = this.store.queryRecord('landscape', 'latest-landscape');
	},
	
	
	//The update also starts with the reloading if shallBeReloaded is true
	startUpdate: function(){
			if(!this.get("updateThread")){
				this.updateObject();
				this.set("updateThread", Ember.run.later(this, this.updateLoop, (10*1000)));
			}
			this.startReload();
	}.observes("isAuthenticated"),
	
	stopUpdate: function(){
		if(this.get("updateThread")){
		this.get("updateThread").run.cancel();
		}
		this.set("updateThread", null);
	},
	
	
	startReload: function(){
		if(this.get("shallReload")){
			this.stopReload();
			this.set("reloadThread", Ember.run.later(this, this.reloadObjects, 100));
		}
	}.observes("shallReload"),
	
	stopReload: function(){
		this.set("shallReload", false);
		if(this.get("reloadThread") && this.get("reloadThread").run){
			this.get("reloadThread").run.cancel();
		}
		this.set("reloadThread", null);
	},
	
	
	
	//This function has to be overwritten
	reloadObjects: function(){
	},
	
	
	
	//@override
	init(){
		//this.get("isAuthenticated") starts the observer too.
		if(this.get("isAuthenticated") === true){
			this.reloadLoop();
		}
	}
	
	
});
