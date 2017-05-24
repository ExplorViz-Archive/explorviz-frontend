import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
	requestURL(){
		console.log("requestURL");
		this.trigger('requestURL');
	},
	test2(state){
		console.log("test2");
		this.trigger('test2',state);
	}

});
