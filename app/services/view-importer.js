import Ember from 'ember';

/**
This service is used to pass data from the component to the controller. 
*/
export default Ember.Service.extend(Ember.Evented, {
	/**
	This method is implemented in the subcomponents of "rendering-core" to create a state out of 
	the controllers query paramters. 
	This state contains the camera axis (x,y,z), id and timestamp.
	*/
	requestView(){
		this.trigger('requestView');
	},
	/**
	This method is used to pass the state to the controller. 
	It's triggered in "rendering-core" by the function above.
	*/
	transmitView(newState){
		this.trigger('transmitView',newState);
	}
});