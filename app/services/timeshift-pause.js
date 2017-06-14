import Ember from 'ember';

/**
This service is used to stop the timeshift after view export
*/
export default Ember.Service.extend(Ember.Evented, {

	stopTimeshift(){
		this.trigger('stopTimeshift');
	}
});