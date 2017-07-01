import Ember from 'ember';

/**
This service is used to pass data from the controller to the component. 
*/
export default Ember.Service.extend(Ember.Evented, {

	importedURL: false,

	/**
	This method is implemented in the controller to create a state out of 
	the controllers query parameters. 
	This state contains the camera axis (x,y,z), id and timestamp.
	*/
	requestView(){		
		this.trigger('requestView');
	},
	/**
	This method is used to pass the state to the component. 
	It's triggered in the controller.
	*/
	transmitView(newState){
		if(newState.timestamp) {
			this.set('importedURL', true);
		}
		
		this.trigger('transmitView',newState);
	}
});
