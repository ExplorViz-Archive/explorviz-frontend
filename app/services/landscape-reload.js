import Ember from 'ember';
import Reload from './data-reload';

export default Reload.extend({


	landscapeRepo: Ember.inject.service("landscape-repository"),


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
			self.debug("end landscape-request");
			self.set('landscapeRepo.latestLandscape', landscape);
			//self.set("object", landscape);
		}
	
		function failure(e){
			self.debug("Landscape couldn't be requested!", e);
		}
		
		
		function error(e){
			self.debug("Error when fetching landscape: ", e);
		}
	//------------End of inner functions------------

	}

});