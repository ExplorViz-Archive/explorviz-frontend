import Reload from 'explorviz-frontend/services/data-reload';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { inject as service } from '@ember/service';

/**
* This service reloads the latest-landscape every tenth second. See
* {{#crossLink "Service-Start"}}{{/crossLink}} for more information.
*
* @class Landscape-Reload-Service
* @extends Data-Reload-Service
*/

export default Reload.extend(AlertifyHandler, {

  agentRepo: service("repos/agent-repository"),

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

    this.debug("start agents-request");
    this.get("store").findAll('agent')
      .then(success, failure).catch(error);

    //--------------inner functions--------------
    function success(agentList){
      self.debug("end agents-request");
      self.set('agentRepo.agentList', agentList);
    }

    function failure(e){
      self.showAlertifyMessage("Agents couldn't be requested!" +
        " Backend offline?");
      self.debug("Agents couldn't be requested!", e);
    }


    function error(e){
      self.debug("Error when fetching agents: ", e);
    }
    //------------End of inner functions------------

  }

});