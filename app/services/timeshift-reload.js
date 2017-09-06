import Reload from './data-reload';
import Ember from "ember";
import AlertifyHandler from 'explorviz-ui-frontend/mixins/alertify-handler';

/**
* This service fetches the timestamps every tenth second. In addition it 
* reloads timestamps. {{#crossLink "Service-Start"}}{{/crossLink}} for more 
* information.
* 
* @class Timeshift-Reload
* @extends Reload
*/

export default Reload.extend(AlertifyHandler, {

	timestampRepo: Ember.inject.service("repos/timestamp-repository"),

  // @Override
  /**
   * TODO
   *
   * @method init
   */
	init() {
		this._super(...arguments);
		this.set('shallReload', true);
	},



  // @Override
  /**
   * TODO
   *
   * @method updateObject
   */
	updateObject(){
		const self = this;

		this.debug("start timestamp-fetch");
		this.get("store").query('timestamp', '1')
			.then(success, failure).catch(error);
	
		//------------- Start of inner functions of updateObject ---------------
		function success(timestamps){			
			self.set('timestampRepo.latestTimestamps', timestamps);
			self.debug("end timestamp-fetch");
		}
	
		function failure(e){
			self.showAlertifyMessage("Timestamps couldn't be requested!" +
        " Backend offline?");
      self.debug("Timestamps couldn't be requested!", e);
		}
		
		function error(e){
			console.error(e);
		}
		
		
		//------------- End of inner functions of getData ---------------
	
	},
	
	//@override
	reloadObjects(){
		if(!this.get("shallReload")){
			return;
		}
		const self = this;
		var timestamps = this.get("store").peekAll("timestamp").sortBy("id");
		var oldestTimestamp = timestamps.get("firstObject");
		
		if(!oldestTimestamp){
			//if there is no Object, the service shall wait for a second, then reload
			this.set("reloadThread", Ember.run.later(this, 
				function(){
					this.set("shallReload", true);
				},1000));     
			return;
		}

		const id = oldestTimestamp.get("id");
		var requestedTimestamps = this.get("store").query('timestamp', id);
		requestedTimestamps.then(success, failure).catch(error);
			
		function success(timestamps){
			const length = timestamps.get("length");
			if(length !== 0){
				timestamps.forEach(function(timestamp){
					self.get("store").push(timestamp.serialize({includeId:true}));
				});
				self.startReload();
			}
		}
		
		function failure(e){
			console.error(e.message);
		}
		
		function error(e){
			console.error(e);
		}
	},
	
	
});
