import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service('store'),
	object:null,
	
	//Hier werden die benötigten Teile "erneuert". Später würde hier vielleicht noch Platz für Notifications 
	//Platz finden
	reload(){
		this.updateObject();
		console.log(this.object);
		},
	
	
	//Hier ist die Endlosschleife, die alle 10 Sekunden, die Funktion ausführt.
	reloadLoop(){
		this.reload();
		Ember.run.later(this, function(){this.reloadLoop();}, (10*1000));
	},
	
	//In dieser Funktion soll genauer identifiziert werden, woher das Modell für unser Objekt genommen wird.
	//Dies entscheidet auch für den Funktionsaufrufg "object.reload()" von welcher URL das Modell bezigen werden
	//soll
	updateObject(){
		// z.B. object = this.store.queryRecord('landscape', 'latest-landscape');
	},
	
	startWorking(){
		this.reloadLoop();
	},
	
	
});
