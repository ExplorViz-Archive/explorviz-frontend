import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import DS from 'ember-data';
import { set } from '@ember/object';
import {
  preProcessAndEnhanceStructureLandscape, StructureLandscapeData,
} from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { DynamicLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import TimestampRepository from './repos/timestamp-repository';
import Auth from './auth';
import LandscapeTokenService from './landscape-token';

export default class LandscapeListener extends Service.extend(Evented) {
  @service('store') store!: DS.Store;

  @service('repos/timestamp-repository') timestampRepo!: TimestampRepository;

  @service('auth') auth!: Auth;

  @service('landscape-token') tokenService!: LandscapeTokenService;

  latestStructureData: StructureLandscapeData|null = null;

  latestDynamicData: DynamicLandscapeData|null = null;

  debug = debugLogger();

  timer: NodeJS.Timeout|null = null;

  async initLandscapePolling(intervalInSeconds: number = 10) {
    function setIntervalImmediately(func: () => void, interval: number) {
      func();
      return setInterval(func, interval);
    }

    this.timer = setIntervalImmediately(async () => {
      try {
        // request landscape data that is 60 seconds old
        // that way we can be sure, all traces are available
        const endTime = Date.now() - (60 * 1000);
        const [structureData, dynamicData] = await this.requestData(endTime, intervalInSeconds);

        this.set('latestStructureData', preProcessAndEnhanceStructureLandscape(structureData));

        this.set('latestDynamicData', dynamicData);

        this.updateTimestampRepoAndTimeline(endTime,
          LandscapeListener.computeTotalRequests(this.latestDynamicData!));

        this.trigger('newLandscapeData', this.latestStructureData, this.latestDynamicData);
      } catch (e) {
        // landscape data could not be requested, try again?
      }
    }, intervalInSeconds * 1000);
  }

  async requestData(endTime: number, intervalInSeconds: number) {
    const startTime = endTime - (intervalInSeconds * 1000);

    const structureDataPromise = this.requestStructureData(/* startTime, endTime */);
    const dynamicDataPromise = this.requestDynamicData(startTime, endTime);

    const landscapeData = Promise.all([structureDataPromise, dynamicDataPromise]);
    return landscapeData;
  }

  requestStructureData(/* fromTimestamp: number, toTimestamp: number */) {
    return new Promise<StructureLandscapeData>((resolve, reject) => {
      if (this.tokenService.token === null) {
        reject(new Error('No landscape token selected'));
        return;
      }
      fetch(`http://localhost:32680/v2/landscapes/${this.tokenService.token.value}/structure`, {
        headers: {
          Authorization: `Bearer ${this.auth.accessToken}`,
        },
      })
        .then(async (response: Response) => {
          if (response.ok) {
            const structureData = await response.json() as StructureLandscapeData;
            resolve(structureData);
          } else {
            reject();
          }
        })
        .catch((e) => reject(e));
    });
  }

  requestDynamicData(fromTimestamp: number, toTimestamp: number) {
    return new Promise<DynamicLandscapeData>((resolve, reject) => {
      if (this.tokenService.token === null) {
        reject(new Error('No landscape token selected'));
        return;
      }
      fetch(`http://localhost:32681/v2/landscapes/${this.tokenService.token.value}/dynamic?from=${fromTimestamp}&to=${toTimestamp}`, {
        headers: {
          Authorization: `Bearer ${this.auth.accessToken}`,
        },
      })
        .then(async (response: Response) => {
          if (response.ok) {
            const dynamicData = await response.json() as DynamicLandscapeData;
            resolve(dynamicData);
          } else {
            reject();
          }
        })
        .catch((e) => reject(e));
    });
  }

  static computeTotalRequests(dynamicData: DynamicLandscapeData) {
    // cant't run reduce on empty array
    if (dynamicData.length === 0) {
      return 0;
    }
    const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
    return dynamicData.map((trace) => trace.spanList.length).reduce(reducer);
  }

  updateTimestampRepoAndTimeline(timestamp: number, totalRequests: number) {
    /**
     * Generates a unique string ID
     */
    //  See: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function uuidv4() {
      /* eslint-disable */
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      /* eslint-enable */
    }

    const timestampRecord = this.store.createRecord('timestamp', { id: uuidv4(), timestamp, totalRequests });
    set(this.timestampRepo, 'latestTimestamp', timestampRecord);

    // this syntax will notify the template engine to redraw all components
    // with a binding to this attribute
    set(this.timestampRepo, 'timelineTimestamps', [...this.timestampRepo.timelineTimestamps, timestampRecord]);

    this.timestampRepo.triggerTimelineUpdate();
  }
}

declare module '@ember/service' {
  interface Registry {
    'landscape-listener': LandscapeListener;
  }
}
