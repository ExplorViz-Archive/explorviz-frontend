import Reload from './data-reload';

export default Reload.extend({
	/*
		this service starts working with the application. Look "instance-initializer/service-start" for more information
	*/
	
	//@Override
	updateObject(){
		const self = this;
		this.get("store").queryRecord('landscape', 'latest-landscape').then(success, failure).catch(error);
	
	//-------------------------------------------------inner functions---------------------------------------
		function success(landscape){
			self.set("object", landscape);
		}
	
		function failure(){
			console.log("Landscape could`t be requested");
		}
		
		
		function error(e){
			console.log(e);
		}
	//-----------------------------------------------End of inner functions----------------------------------
	}
});