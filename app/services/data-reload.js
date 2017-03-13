import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service('store'),
	object:null,
	session: Ember.inject.service("session"),
	isAuthenticated: Ember.computed.oneWay("session.isAuthenticated"),
	previousRequestDone: true,
	active: true,
	
	/* this service is used like an abstract service
	it only works with an "authenticated session". It will start immediatly working, when the session is authenticated 
	*/
	
	
	//This loop works infinetly, unless the session is authenticated
	reloadLoop: function(){
		if(this.get("isAuthenticated") === true && this.get('active')){
			this.updateObject();
			Ember.run.later(this, function(){this.reloadLoop();}, (10*1000));
		}
	}.observes("isAuthenticated", "active"),
	
	//This function is the part, which has to be overwritten by extending services (e.g. landscape-reload) 
	updateObject(){
		// z.B. object = this.store.queryRecord('landscape', 'latest-landscape');
	},
	
	
	//@override
	init(){
		//this.get("isAuthenticated") starts the observer too.
		if(this.get("isAuthenticated") === true){
			this.reloadLoop();
		}
	}
	
	
});
