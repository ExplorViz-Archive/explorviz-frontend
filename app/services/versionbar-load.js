import Service from '@ember/service';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { inject as service } from '@ember/service';
import { computed} from '@ember/object';

/**
 * This service loads the data for the {{#crossLink "timestamp-versionbar"}}{{/crossLink}}.
 *
 * @class Versionbar-Load-Service
 * @extends Ember.Service
 */
export default Service.extend(AlertifyHandler, {

  store: service(),
  session: service(),
  timestampRepo: service('repos/timestamp-repository'),

  isAuthenticated: computed.oneWay("session.isAuthenticated"),

  init() {
    this._super(...arguments);
    this.receiveUploadedObjects();

    if(this.get("isAuthenticated") === true){
            this.receiveUploadedObjects();
    }
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
      self.debug("Error when fetching uploaded timestamps: ", e);
    }


    //------------- End of inner functions of getData ---------------

  },

});
