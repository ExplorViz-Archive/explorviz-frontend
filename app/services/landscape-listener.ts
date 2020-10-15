import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import DS from 'ember-data';
import { set } from '@ember/object';
import Timestamp from 'explorviz-frontend/models/timestamp';
import { AjaxServiceClass } from 'ember-ajax/services/ajax';
import {
  preProcessAndEnhanceStructureLandscape, RawStructureLandscapeData, StructureLandscapeData,
} from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { DynamicLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import LandscapeRepository from './repos/landscape-repository';
import TimestampRepository from './repos/timestamp-repository';
import TestLandscape from './test-landscape';
import TestDynamicData from './test-dynamic-data';

export default class LandscapeListener extends Service.extend(Evented) {
  @service('session') session!: any;

  @service('store') store!: DS.Store;

  @service('repos/timestamp-repository') timestampRepo!: TimestampRepository;

  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  @service('ajax') ajax!: AjaxServiceClass;

  latestStructureData: StructureLandscapeData|null = null;

  latestDynamicData: DynamicLandscapeData|null = null;

  pauseVisualizationReload = false;

  debug = debugLogger();

  async initLandscapeStructurePolling() {
    // eslint-disable-next-line @typescript-eslint/camelcase
    // const { access_token } = this.session.data.authenticated;

    const fulfill = (landscapeStructure: RawStructureLandscapeData) => {
      set(this, 'latestStructureData', preProcessAndEnhanceStructureLandscape(landscapeStructure));
    };

    const testStructure: RawStructureLandscapeData = TestLandscape as RawStructureLandscapeData;
    fulfill(testStructure);
  }

  async initLandscapeDynamicPolling() {
    const fulfill = (landscapeDynamicData: DynamicLandscapeData) => {
      this.set('latestDynamicData', landscapeDynamicData);
      this.landscapeRepo.triggerLatestLandscapeUpdate();
    };

    const testDynamic: DynamicLandscapeData = TestDynamicData as DynamicLandscapeData;
    fulfill(testDynamic);
  }

  requestStructureData() {
    return new Promise((resolve /* reject */) => {
      this.ajax.request('http://localhost:32680/v2/landscapes/sample_token/structure')
        /* .then((data: Landscape) => resolve(data)); */
        .then((data: StructureLandscapeData) => resolve(data));
    });
  }

  requestDynamicData() {
    return new Promise((resolve /* reject */) => {
      this.ajax.request('http://localhost:32681/v2/landscapes/fibonacci-sample-landscape/dynamic')
        .then((data: any) => resolve(data));
    });
  }

  updateTimestampRepoAndTimeline(this: LandscapeListener, timestamp: Timestamp) {
    set(this.timestampRepo, 'latestTimestamp', timestamp);

    // this syntax will notify the template engine to redraw all components
    // with a binding to this attribute
    set(this.timestampRepo, 'timelineTimestamps', [...this.timestampRepo.timelineTimestamps, timestamp]);

    this.timestampRepo.triggerTimelineUpdate();
  }

  toggleVisualizationReload() {
    // TODO: need to notify the timeline
    if (this.pauseVisualizationReload) {
      this.startVisualizationReload();
    } else {
      this.stopVisualizationReload();
    }
  }

  startVisualizationReload() {
    set(this, 'pauseVisualizationReload', false);
    this.trigger('visualizationResumed');
  }

  stopVisualizationReload() {
    set(this, 'pauseVisualizationReload', true);
  }
}

declare module '@ember/service' {
  interface Registry {
    'landscape-listener': LandscapeListener;
  }
}
