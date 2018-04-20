import Service from '@ember/service';
import Evented from '@ember/object/evented';

/**
This service is used to pass data from the component to the controller. 
*/
export default Service.extend(Evented, {
	/**
	This method is implemented in "rendering-core" to create a state out of 
	the component's data, which is not contained in the model. 
	This state contains the camera axis (x,y,z).
	*/
	requestURL(){
		this.trigger('requestURL');
	},
	/**
	This method is used to pass the state to the controller. 
	It's triggered in "rendering-core" by the function above.
	*/
	transmitState(state){
		this.trigger('transmitState',state);
	}
});
