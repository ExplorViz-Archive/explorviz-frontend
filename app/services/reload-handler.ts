import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';

import debugLogger from 'ember-debug-logger';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import addDrawableCommunication from 'explorviz-frontend/utils/model-update';
import DS from 'ember-data';
import { set } from '@ember/object';
import Landscape from 'explorviz-frontend/models/landscape';
import LandscapeListener from './landscape-listener';
import LandscapeRepository from './repos/landscape-repository';


export default class ReloadHandler extends Service.extend(Evented) {
  @service('store') store!: DS.Store;

  @service('landscape-listener') landscapeListener!: LandscapeListener;

  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  debug = debugLogger();

  /**
   * Loads a landscape from the backend and triggers a visualization update
   * @method loadLandscapeById
   * @param {*} timestamp
   */
  loadLandscapeById(timestamp: number) {
    const self = this;

    self.debug('Start import landscape-request');

    function success(landscape: Landscape) {
      // Pause the visualization
      self.landscapeListener.stopVisualizationReload();
      addDrawableCommunication(self.store);

      set(self.landscapeRepo, 'latestLandscape', landscape);
      self.landscapeRepo.triggerLatestLandscapeUpdate();

      self.debug('end import landscape-request');
    }

    function failure(e: any) {
      set(self.landscapeRepo, 'latestLandscape', null);
      AlertifyHandler.showAlertifyMessage("Landscape couldn't be requested!"
        + ' Backend offline?');
      self.debug("Landscape couldn't be requested!", e);
    }

    function error(e: any) {
      set(self.landscapeRepo, 'latestLandscape', null);
      self.debug('Error when fetching landscape: ', e);
    }

    self.store.queryRecord('landscape', { timestamp }).then(success, failure).catch(error);
  }

  /**
   * Loads a replaylandscape from the backend and triggers a visualization update
   * @method loadReplayLandscapeByTimestamp
   * @param {*} timestamp
   */
  loadReplayLandscapeByTimestamp(timestamp: number) {
    const self = this;

    self.debug('Start import replay landscape-request');

    function success(landscape: Landscape) {
      // Pause the visualization
      addDrawableCommunication(self.store);

      set(self.landscapeRepo, 'replayLandscape', landscape);
      self.landscapeRepo.triggerLatestReplayLandscapeUpdate();

      self.debug('end import replay landscape-request');
    }

    function failure(e: any) {
      set(self.landscapeRepo, 'replayLandscape', null);
      AlertifyHandler.showAlertifyMessage("Replay Landscape couldn't be requested!"
        + ' Backend offline?');
      self.debug("Repplay Landscape couldn't be requested!", e);
    }

    function error(e: any) {
      set(self.landscapeRepo, 'replayLandscape', null);
      self.debug('Error when fetching replaylandscape: ', e);
    }

    self.store.queryRecord('landscape', { timestamp }).then(success, failure).catch(error);
  }
}

declare module '@ember/service' {
  interface Registry {
    'reload-handler': ReloadHandler;
  }
}
