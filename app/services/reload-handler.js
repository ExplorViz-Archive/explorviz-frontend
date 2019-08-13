import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import debugLogger from 'ember-debug-logger';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import ModelUpdater from 'explorviz-frontend/utils/model-update';


export default Service.extend(AlertifyHandler, Evented, {

  store: service(),
  landscapeListener: service("landscape-listener"),
  landscapeRepo: service("repos/landscape-repository"),

  debug: debugLogger(),
  modelUpdater: null,

  init() {
    this._super(...arguments);
    if (!this.get('modelUpdater')) {
      this.set('modelUpdater', ModelUpdater.create(getOwner(this).ownerInjection()));
    }
  },

  /**
   * Loads a landscape from the backend and triggers a visualization update
   * @method loadLandscapeById
   * @param {*} timestamp 
   */
  loadLandscapeById(timestamp) {
    const self = this;

    self.debug("Start import landscape-request");

    self.get('store').queryRecord('landscape', { timestamp: timestamp }).then(success, failure).catch(error);

    function success(landscape) {
      // Pause the visualization
      self.get('landscapeListener').stopVisualizationReload();
      self.get('modelUpdater').addDrawableCommunication();

      self.set('landscapeRepo.latestLandscape', landscape);
      self.get('landscapeRepo').triggerLatestLandscapeUpdate();

      self.debug("end import landscape-request");
    }

    function failure(e) {
      self.set('landscapeRepo.latestLandscape', undefined);
      self.showAlertifyMessage("Landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Landscape couldn't be requested!", e);
    }

    function error(e) {
      self.set('landscapeRepo.latestLandscape', undefined);
      self.debug("Error when fetching landscape: ", e);
    }
  }

});
