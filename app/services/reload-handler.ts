import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import debugLogger from 'ember-debug-logger';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import ModelUpdater from 'explorviz-frontend/utils/model-update';
import DS from 'ember-data';
import LandscapeListener from './landscape-listener';
import LandscapeRepository from './repos/landscape-repository';
import { set } from '@ember/object';
import Landscape from 'explorviz-frontend/models/landscape';


export default class ReloadHandler extends Service.extend(Evented) {

  @service('store') store!: DS.Store;
  @service('landscape-listener') landscapeListener!: LandscapeListener;
  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  debug = debugLogger();
  modelUpdater:any = null;

  constructor() {
    super(...arguments);
    if (!this.modelUpdater) {
      set(this, 'modelUpdater', ModelUpdater.create(getOwner(this).ownerInjection()));
    }
  }

  /**
   * Loads a landscape from the backend and triggers a visualization update
   * @method loadLandscapeById
   * @param {*} timestamp 
   */
  loadLandscapeById(timestamp:number) {
    const self = this;

    self.debug("Start import landscape-request");

    self.store.queryRecord('landscape', { timestamp: timestamp }).then(success, failure).catch(error);

    function success(landscape:Landscape) {
      // Pause the visualization
      self.landscapeListener.stopVisualizationReload();
      self.modelUpdater.addDrawableCommunication();

      set(self.landscapeRepo, 'latestLandscape', landscape);
      self.landscapeRepo.triggerLatestLandscapeUpdate();

      self.debug("end import landscape-request");
    }

    function failure(e:any) {
      set(self.landscapeRepo, 'latestLandscape', null);
      AlertifyHandler.showAlertifyMessage("Landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Landscape couldn't be requested!", e);
    }

    function error(e:any) {
      set(self.landscapeRepo, 'latestLandscape', null);
      self.debug("Error when fetching landscape: ", e);
    }
  }

  /**
   * Loads a replaylandscape from the backend and triggers a visualization update
   * @method loadReplayLandscapeByTimestamp
   * @param {*} timestamp 
   */
  loadReplayLandscapeByTimestamp(timestamp:number) {
    const self = this;

    self.debug("Start import replay landscape-request");

    self.store.queryRecord('landscape', { timestamp: timestamp }).then(success, failure).catch(error);

    function success(landscape:Landscape) {
      // Pause the visualization
      self.modelUpdater.addDrawableCommunication();

      set(self.landscapeRepo, 'replayLandscape', landscape);
      self.landscapeRepo.triggerLatestReplayLandscapeUpdate();

      self.debug("end import replay landscape-request");
    }

    function failure(e:any) {
      set(self.landscapeRepo, 'replayLandscape', null);
      AlertifyHandler.showAlertifyMessage("Replay Landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Repplay Landscape couldn't be requested!", e);
    }

    function error(e:any) {
      set(self.landscapeRepo, 'replayLandscape', null);
      self.debug("Error when fetching replaylandscape: ", e);
    }
  }

}

declare module "@ember/service" {
  interface Registry {
    "reload-handler": ReloadHandler;
  }
}
