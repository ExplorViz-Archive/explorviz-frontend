import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import debugLogger from 'ember-debug-logger';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import ModelUpdater from 'explorviz-frontend/utils/model-update';


export default Service.extend(AlertifyHandler, Evented, {

  debug: debugLogger(),

  landscapeRepo: service("repos/landscape-repository"),
  timestampRepo: service("repos/timestamp-repository"),
  store: service(),

  modelUpdater: null,

  landscapeListener: service("landscape-listener"),

  init(){
    this._super(...arguments);
    if (!this.get('modelUpdater')) {
      this.set('modelUpdater', ModelUpdater.create(getOwner(this).ownerInjection()));
    }
  },

  /**
   * Loads a landscape from the backend and triggers a visualization update
   * @method loadLandscapeById
   * @param {*} timestamp 
   * @param {*} appID 
   */
  loadLandscapeById(timestamp, appID) { // eslint-disable-line

    const self = this;

    self.debug("start import landscape-request");

    self.get('store').queryRecord('landscape', {timestamp: timestamp}).then(success, failure).catch(error);

    function success(landscape){

      // pause the visulization
      self.get('landscapeListener').stopVisualizationReload();

      self.get('modelUpdater').addDrawableCommunication();
      
      self.set('landscapeRepo.latestLandscape', landscape);
      self.get('landscapeRepo').triggerLatestLandscapeUpdate();

      //if (appID) {
      //  const app = self.get('store').peekRecord('application', appID);
       // self.set('landscapeRepo.latestApplication', app);
      //}      

      self.debug("end import landscape-request");
    }

    function failure(e){
      self.set('landscapeRepo.latestLandscape', undefined);
      self.showAlertifyMessage("Landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Landscape couldn't be requested!", e);
    }

    function error(e){
      self.set('landscapeRepo.latestLandscape', undefined);
      self.debug("Error when fetching landscape: ", e);
    }

  }

});
