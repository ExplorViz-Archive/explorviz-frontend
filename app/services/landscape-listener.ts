import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { Package, preProcessAndEnhanceStructureLandscape, StructureLandscapeData, } 
  from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { DynamicLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import ENV from 'explorviz-frontend/config/environment';
import TimestampRepository, { Timestamp } from './repos/timestamp-repository';
import Auth from './auth';
import LandscapeTokenService from './landscape-token';
import ConfigurationRepository from './repos/configuration-repository';

const { landscapeService, traceService } = ENV.backendAddresses;

export default class LandscapeListener extends Service.extend(Evented) {
  @service('repos/timestamp-repository') timestampRepo!: TimestampRepository;

  @service('repos/configuration-repository') configRepo!: ConfigurationRepository;

  @service('auth') auth!: Auth;

  @service('landscape-token') tokenService!: LandscapeTokenService;

  latestStructureData: StructureLandscapeData | null = null;

  latestDynamicData: DynamicLandscapeData | null = null;

  slidingWindowMin: number = this.timestampRepo.minTimestamp;
  slidingWindowMax: number = this.timestampRepo.maxTimestamp;
  timeline: NodeJS.Timeout | null = null;
  currentlyUpdating: boolean = false;

  debug = debugLogger();

  visualisation: NodeJS.Timeout | null = null;

  async initLandscapePolling(intervalInSeconds: number = 10) {
    this.timestampRepo.triggerTimelineUpdate();
    function setIntervalImmediately(func: () => void, interval: number) {
      func();
      return setInterval(func, interval);
    }

    this.visualisation = setIntervalImmediately(async () => {
      try {
        await this.updateWindowTimestamps();
        // request landscape data that is 60 seconds old
        // that way we can be sure, all traces are available
        const endTime = Date.now() - (60 * 1000);
        const [structureData, dynamicData] = await this.requestData(endTime, intervalInSeconds);
        this.set('latestStructureData', preProcessAndEnhanceStructureLandscape(structureData));
        this.set('latestDynamicData', dynamicData);
        this.trigger('newLandscapeData', this.latestStructureData, this.latestDynamicData);
      } catch (e) {
        // landscape data could not be requested, try again?
      }
    }, intervalInSeconds * 1000);
    this.timeline = setIntervalImmediately(async () => {
      try {
        // Request data and update timeline accordingly
        if(!this.currentlyUpdating) {
          await this.updateWindowTimestamps();
        }
      } catch (e) {
        // landscape data could not be requested, try again?
      }
    }, 5 * 1000);
    await this.updateWindowData(null);
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
      fetch(`${landscapeService}/v2/landscapes/${this.tokenService.token.value}/structure`, {
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
      fetch(`${traceService}/v2/landscapes/${this.tokenService.token.value}/dynamic?from=${fromTimestamp}&to=${toTimestamp}`, {
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
  async updateWindowData(userSlidingWindow: any) {
    let minTimestamp, maxTimestamp;
    if (userSlidingWindow) {
      minTimestamp = Date.parse(userSlidingWindow.xaxis.range[0]);
      maxTimestamp = Date.parse(userSlidingWindow.xaxis.range[1]);
    }

    if (!userSlidingWindow || !minTimestamp || !maxTimestamp) {
      //Default values: -5 minutes until now
      minTimestamp = Date.now() - (6 * 60 * 1000);
      maxTimestamp = Date.now();

    }
    const n = maxTimestamp - minTimestamp;
    minTimestamp -= Math.round(n/2);
    maxTimestamp += Math.round(n/2);

    this.slidingWindowMin = minTimestamp;
    this.slidingWindowMax = maxTimestamp;
  }
  async updateWindowTimestamps(intervalInSeconds: number = 10) {
    this.currentlyUpdating = true;
    const landscapeToken = this.tokenService.token!.value;
    const now = Date.now() - (60 * 1000);
    // Get current borders
    let minTimestamp = this.timestampRepo.minTimestamp;
    let maxTimestamp = this.timestampRepo.maxTimestamp;

    if (this.slidingWindowMin != minTimestamp || this.slidingWindowMax != maxTimestamp) {
      // Update Window Borders
      this.timestampRepo.set('minTimestamp', this.slidingWindowMin);
      minTimestamp = this.slidingWindowMin;
      this.timestampRepo.set('maxTimestamp', this.slidingWindowMax);
      maxTimestamp = this.slidingWindowMax;

      // Unload unnecessary timestamps
      this.timestampRepo.filterSlidingWindow(landscapeToken);
    }
    let first = this.timestampRepo.getFirstTimestamp(landscapeToken)?.timestamp ?? minTimestamp;
    let last = this.timestampRepo.getLatestTimestamp(landscapeToken)?.timestamp ?? first;

    // Load necessary timestamps (Fill buffer)
    // First: Fill up the gap between the latest timestamp and the right border (maxTimestamp / now)
    if (last <= maxTimestamp && last <= now) {
      last += (intervalInSeconds * 1000);
      while(last <= maxTimestamp && last <= now) {
        await this._updateSlidingWindow(last, intervalInSeconds);
        last += (intervalInSeconds * 1000);
      }
      this.timestampRepo.triggerTimelineUpdate();
    }

    // Second: Fill up the gap between the left border (minTimestamp) and the first timestamp
    if (minTimestamp <= first) {
      first -= (intervalInSeconds * 1000);
      while(minTimestamp <= first) {
        await this._updateSlidingWindow(first, intervalInSeconds, true);
        first -= (intervalInSeconds * 1000);
      }
      this.timestampRepo.triggerTimelineUpdate();
    }
    this.currentlyUpdating = false;
  }

  async _updateSlidingWindow(endTime: number, intervalInSeconds: number, front : boolean = false) {
    // Copied from above (initLandscapePolling)
    const [structureData, dynamicData] = await this.requestData(endTime, intervalInSeconds);
    const processedStructureData = preProcessAndEnhanceStructureLandscape(structureData);

    const appData = LandscapeListener.computeMetricDataPerApp(this.tokenService.token!.value, this.configRepo, dynamicData, processedStructureData);
    const genData = LandscapeListener.computeTotalMetricData(appData);

    this.updateTimestampRepoAndTimeline(endTime, appData, genData, front);
  }

  static generateApplicationData(structureData: StructureLandscapeData) {
    const applicationData = new Map<string, string>(); // Matches Methods hashcodes (found in spans) to applications
    structureData.nodes.forEach((node) => node.applications.forEach((app) => {
      const applicationName = app.name;
      app.packages.forEach((component) => this._generateApplicationData(applicationData, applicationName, component));
    }));
    return applicationData;
  }

  static _generateApplicationData(applicationData: Map<string, string>, applicationName: string, component: Package) {
    component.classes.forEach((subcomponent) => subcomponent.methods.forEach((method) => applicationData.set(method.hashCode, applicationName)));
    component.subPackages.forEach((subcomponent) => this._generateApplicationData(applicationData, applicationName, subcomponent));
  }

  static computeTotalMetricData(metricDataPerApp: Map<string, Map<string, number>>) {
    const totalMetricData = new Map<string, number>();
    
    Array.from(metricDataPerApp.values()).forEach(app => Array.from(app.keys()).forEach(metric => {
      const currentValue = totalMetricData.get(metric) ?? 0;
      totalMetricData.set(metric, currentValue + (app.get(metric)!));
    }) );
    return totalMetricData;
  }

  static computeMetricDataPerApp(landscapeToken: string, configRepo: ConfigurationRepository ,dynamicData: DynamicLandscapeData, structureData: StructureLandscapeData) {
    const data = new Map<string, Map<string, number>>();
    structureData.nodes.forEach((node) => node.applications.forEach((app) => data.set(app.name, new Map<string, number>())));
    
    if (dynamicData.length !== 0) {
      const applicationData = this.generateApplicationData(structureData);
      dynamicData.forEach((trace) => trace.spanList.forEach((span) => {
        configRepo.addSoftwaremetric(landscapeToken, span.metric);

        const app = applicationData.get(span.hashCode);
        if (app) {
          const currentValue = data.get(app)!.get(span.metric) ?? 0
          data.get(app)?.set(span.metric, currentValue + 1);
        }

      }));
    }
    return data
  }

  updateTimestampRepoAndTimeline(timestamp: number, applicationData: Map<string, Map<string, number>>, generalData: Map<string, number>, front: boolean = false) {
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
    const landscapeToken = this.tokenService.token!.value;

    const appData : Map<string, Timestamp> = new Map<string, Timestamp>(); // Timestamp per Application
    applicationData.forEach((data, app) => appData.set(app, {id: uuidv4(), timestamp, data}));

    const genData : Timestamp = { id : uuidv4(), timestamp, data: generalData}; // Timestamp for total landscape

    const record = { id: uuidv4(), timestamp, structuredData: appData, generalData: genData};
    this.timestampRepo.addTimestamp(landscapeToken, record, front);
  }

  getConfiguration() {
    const active = this.configRepo.getActiveConfigurations(this.tokenService.token!.value);
    const config = this.configRepo.getConfiguration(this.tokenService.token!.value);
    return {config, active};
  }
}

declare module '@ember/service' {
  interface Registry {
    'landscape-listener': LandscapeListener;
  }
}
