import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { inject as service } from '@ember/service';
import debugLogger from 'ember-debug-logger';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Service.extend(AlertifyHandler, Evented, {

  debug: debugLogger(),

  landscapeRepo: service("repos/landscape-repository"),
  timestampRepo: service("repos/timestamp-repository"),
  store: service(),

  landscapeListener: service("landscape-listener"),

  /**
   * Loads a landscape from the backend and triggers a visualization update
   * @method loadLandscapeById
   * @param {*} timestamp 
   * @param {*} appID 
   */
  loadLandscapeById(timestamp, appID) {

    const self = this;

    self.debug("start import landscape-request");

    self.get('store').queryRecord('landscape', {timestamp: timestamp}).then(success, failure).catch(error);

    function success(landscape){
      
      self.set('landscapeRepo.latestLandscape', landscape);
      self.get('landscapeRepo').triggerLatestLandscapeUpdate();

      if (appID) {
        const app = self.get('store').peekRecord('application', appID);
        self.set('landscapeRepo.latestApplication', app);
      }

      // pause the visulization
      self.get('landscapeListener').stopVisualizationReload();

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
