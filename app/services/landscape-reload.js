import Ember from 'ember';
import Reload from './data-reload';
import AlertifyHandler from 'explorviz-ui-frontend/mixins/alertify-handler';

/**
* This service reloads the latest-landscape every tenth second. See 
* {{#crossLink "Service-Start"}}{{/crossLink}} for more information.
* 
* @class Landscape-Reload-Service
* @extends Data-Reload-Service
*/

export default Reload.extend(AlertifyHandler, {

  landscapeRepo: Ember.inject.service("repos/landscape-repository"),

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

    this.debug("start landscape-request");
    this.get("store").queryRecord('landscape', 'latest-landscape')
      .then(success, failure).catch(error);

    //--------------inner functions--------------
    function success(landscape){
      self.debug("end landscape-request");
      self.set('landscapeRepo.latestLandscape', landscape);
    }
  
    function failure(e){
      self.showAlertifyMessage("Landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Landscape couldn't be requested!", e);
    }
    
    
    function error(e){
      self.debug("Error when fetching landscape: ", e);
    }
    //------------End of inner functions------------

  }

});