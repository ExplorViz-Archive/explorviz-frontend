import Reload from './data-reload';

export default Reload.extend({
	/*
		This service reloads the latest-landscape every tenth second. 
		Look "instance-initializer/service-start" for more information.
	 */
	

	
	// @Override
	updateObject(){
		const self = this;
		this.debug("start landscape-request");
		this.get("store").queryRecord('landscape', 'latest-landscape')
			.then(success, failure).catch(error);

	//--------------inner functions--------------
		function success(landscape){
			console.log(landscape.serialize());
			self.debug("end landscape-request");
			self.set("object", landscape);
		}
	
		function failure(){
			self.debug("Landscape couldn't be requested!");
		}
		
		
		function error(e){
			self.debug("Error when fetching landscape: " + e);
		}
	//------------End of inner functions------------

	}

});