import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import { set } from '@ember/object';

import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import debugLogger from 'ember-debug-logger';
import DS from 'ember-data';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import addDrawableCommunication from 'explorviz-frontend/utils/model-update';
import Heatmap from 'heatmap/models/heatmap';
import LandscapeMetric from 'heatmap/models/landscape-metric';
import ApplicationMetric from 'heatmap/models/application-metric';
import { tracked } from '@glimmer/tracking';
import { getDefaultGradient as getSimpleDefaultGradient } from '../../utils/simple-heatmap';
import { getDefaultGradient as getArrayDefaultGradient } from '../../utils/array-heatmap';
import { revertKey } from '../../utils/heatmap-generator';

type Heatmaps = {
  landscapeId: string,
  aggregatedHeatmap: LandscapeMetric,
  windowedHeatmap: LandscapeMetric
};

export interface Metric {
  name: string;
  typeName: string;
  description: string;
}

type HeatmapMode = 'aggregatedHeatmap'|'windowedHeatmap';

export default class HeatmapRepository extends Service.extend(Evented) {
  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  @service('store') store!: DS.Store;

  @tracked
  heatmapActive = false;

  // Switch for the legend
  legendActive = true;

  // Heatmap data for rendering
  latestHeatmaps: null|Heatmaps = null;

  latestApplicationHeatmap: null|ApplicationMetric = null;

  latestClazzMetrics = null;

  largestValue = 0;

  metrics: Metric[] = [];

  @tracked
  selectedMetric: null|Metric = null;

  applicationID: null|string = null;

  // Switches and models used by config
  selectedMode: HeatmapMode = 'aggregatedHeatmap';

  useSimpleHeat = true;

  useHelperLines = true;

  opacityValue = 0.03;

  heatmapRadius = 2;

  blurRadius = 0;

  showLegendValues = true;

  simpleHeatGradient = getSimpleDefaultGradient();

  arrayHeatGradient = getArrayDefaultGradient();

  debug = debugLogger();

  triggerLatestHeatmapUpdate() {
    if (this.applicationID) {
      const clazzMetrics = this.computeClazzMetrics(this.applicationID);
      if (clazzMetrics !== null) {
        this.trigger('updatedClazzMetrics', this.latestClazzMetrics);
      }
    }
  }

  triggerMetricUpdate() {
    if (this.applicationID) {
      const clazzMetrics = this.computeClazzMetrics(this.applicationID);
      if (clazzMetrics !== null) {
        this.trigger('newSelectedMetric', this.latestClazzMetrics);
      }
    }
  }

  toggleLegend() {
    this.set('legendActive', !this.legendActive);
  }

  computeClazzMetrics(applicationID: string) {
    let clazzMetrics = null;
    if (this.latestHeatmaps) {
      const selectedMap = this.latestHeatmaps[this.selectedMode];
      if (this.selectedMetric && applicationID) {
        this.set('latestApplicationHeatmap', selectedMap.getApplicationMetric(applicationID, this.selectedMetric.typeName));
        if (this.latestApplicationHeatmap) {
          clazzMetrics = this.latestApplicationHeatmap.getClassMetricValues();
          this.set('latestClazzMetrics', clazzMetrics);
          this.set('largestValue', this.latestApplicationHeatmap.largestValue);
          this.debug('Updated latest clazz metrics.');
        }
      }
    }
    return clazzMetrics;
  }

  /**
   * Update the latest heatmap entry and trigger update.
   * @param {*} heatmap
   */
  updateLatestHeatmap(heatmap: Heatmap) {
    heatmap.get('aggregatedHeatmap').then((aggMap) => {
      heatmap.get('windowedHeatmap').then((windMap) => {
        this.set('latestHeatmaps', { landscapeId: heatmap.landscapeId, aggregatedHeatmap: aggMap, windowedHeatmap: windMap });
        if (this.landscapeRepo.latestLandscape
          && heatmap.landscapeId === this.landscapeRepo.latestLandscape.id) {
          this.triggerLatestHeatmapUpdate();
        } else {
          this.debug('Landscape and heatmap ids do not match. Requesting new landscape...');
          this.requestLandscape(heatmap.timestamp);
          this.triggerLatestHeatmapUpdate();
        }
      });
    });
  }

  /**
   * Return a gradient where the '_' character in the keys is replaced with '.'.
   */
  getSimpleHeatGradient() {
    return revertKey(this.simpleHeatGradient);
  }

  /**
   * Return a gradient where the '_' character in the keys is replaced with '.'.
   */
  getArrayHeatGradient() {
    return revertKey(this.arrayHeatGradient);
  }

  /**
   * Reset the gradient to default values.
   */
  resetSimpleHeatGradient() {
    this.set('simpleHeatGradient', getSimpleDefaultGradient());
  }

  /**
   * Reset the gradient to default values.
   */
  resetArrayHeatGradient() {
    this.set('arrayHeatGradient', getArrayDefaultGradient());
  }

  async requestLandscape(timestamp: number) {
    const self = this;

    try {
      const landscape = await self.store.queryRecord('landscape', { timestamp });
      addDrawableCommunication(self.store);
      set(self.landscapeRepo, 'latestLandscape', landscape);
      self.landscapeRepo.triggerLatestLandscapeUpdate();
      self.triggerLatestHeatmapUpdate();
    } catch (e) {
      self.cleanup();
      set(self.landscapeRepo, 'latestLandscape', null);
      AlertifyHandler.showAlertifyMessage("Model couldn't be requested!"
        + ' Backend offline?');
      self.debug("Model couldn't be requested!", e);
    }
  }

  /**
   * Reset all class attribute values to null;
   */
  cleanup() {
    this.set('latestHeatmaps', null);
    this.set('latestApplicationHeatmap', null);
    this.set('latestClazzMetrics', null);
    this.set('selectedMetric', null);
    this.set('applicationID', null);
    // this.set("metrics", null);
    this.set('largestValue', 0);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'repos/heatmap-repository': HeatmapRepository;
  }
}
