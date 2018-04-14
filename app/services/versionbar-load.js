import Ember from 'ember';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

const {Service} = Ember;

export default Service.extend(AlertifyHandler, {

  store: Ember.inject.service('store'),
  timestampRepo: Ember.inject.service('repos/timestamp-repository'),

  init() {
    this._super(...arguments);
    this.receiveUploadedObjects();
  },



    /**
   * TODO
   *
   * @method updateObject
   */
  receiveUploadedObjects(){
    const self = this;

    this.debug("start uploaded-timestamp-fetch");
    this.get("store").query('timestamp', '2')
      .then(success, failure).catch(error);

    //------------- Start of inner functions of updateObject ---------------
    function success(timestamps){
      self.set('timestampRepo.uploadedTimestamps', timestamps);
      self.get('timestampRepo').triggerUploaded();
      self.debug("end uploaded-timestamp-fetch");
    }

    function failure(e){
      self.showAlertifyMessage("Uploaded timestamps couldn't be requested!" +
        " Backend offline?");
      self.debug("Uploaded timestamps couldn't be requested!", e);
    }

    function error(e){
      console.error(e);
    }


    //------------- End of inner functions of getData ---------------

  },

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
