import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service('store'),
	object:null,
	session: Ember.inject.service("session"),
	isAuthenticated: Ember.computed.oneWay("session.isAuthenticated"),
	
	//Hier werden die benötigten Teile "erneuert". Später würde hier vielleicht noch Platz für Notifications 
	//Platz finden
	
	
	//Hier ist die Endlosschleife, die alle 10 Sekunden, die Funktion ausführt.
	reloadLoop: function(){
		if(this.get("isAuthenticated") === true){
			this.updateObject();
			Ember.run.later(this, function(){this.reloadLoop();}, (10*1000));
		}
	}.observes("isAuthenticated"),
	
	//In dieser Funktion soll genauer identifiziert werden, woher das Modell für unser Objekt genommen wird.
	//Dies entscheidet auch für den Funktionsaufruf "object.reload()" von welcher URL das Modell bezogen werden
	//soll
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
