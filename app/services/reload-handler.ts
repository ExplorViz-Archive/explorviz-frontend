import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';

import debugLogger from 'ember-debug-logger';
import { DynamicLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import { preProcessAndEnhanceStructureLandscape, StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import LandscapeLoader from './landscape-loader';

export default class ReloadHandler extends Service.extend(Evented) {
  @service('landscape-loader') landscapeLoader!: LandscapeLoader;

  debug = debugLogger();

  /**
   * Loads a landscape from the backend and triggers a visualization update
   * @method loadLandscapeById
   * @param {*} timestamp
   */
  async loadLandscapeByTimestamp(timestamp: number, interval: number = 10) {
    const self = this;

    self.debug('Start import landscape-request');

    try {
      const [structureDataRes, dynamicDataRes] = await this.landscapeLoader.requestData(timestamp,
        interval);

      const structureData = structureDataRes.status === 'fulfilled'
        ? preProcessAndEnhanceStructureLandscape(structureDataRes.value) : null;

      const dynamicData = dynamicDataRes.status === 'fulfilled' ? dynamicDataRes.value : null;

      return [structureData, dynamicData] as
        [StructureLandscapeData|null, DynamicLandscapeData|null];
    } catch (e) {
      throw Error(e);
    }
  }
}

declare module '@ember/service' {
  interface Registry {
    'reload-handler': ReloadHandler;
  }
}
