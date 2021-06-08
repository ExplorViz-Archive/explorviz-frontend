import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { tracked } from '@glimmer/tracking';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import { getDefaultGradient as getSimpleDefaultGradient } from '../utils/simple-heatmap';
import { getDefaultGradient as getArrayDefaultGradient } from '../utils/array-heatmap';
import revertKey from '../utils/heatmap-generator';

export type Metric = {
  name: string;
  description: string;
  mode: HeatmapMode,
  min: number,
  max: number,
  values: Map<string, number>
};

type HeatmapMode = 'aggregatedHeatmap'|'windowedHeatmap';

export default class HeatmapConfiguration extends Service.extend(Evented) {
  @tracked
  heatmapActive = false;

  currentApplication: ApplicationObject3D | undefined | null;

  // Switch for the legend
  legendActive = true;

  @tracked
  latestClazzMetrics: Metric[]|null = null;

  largestValue = 0;

  metrics: Metric[] = [];

  @tracked
  selectedMetric: Metric|null = null;

  applicationID: string|null = null;

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
      if (this.latestClazzMetrics !== null) {
        this.trigger('updatedClazzMetrics', this.latestClazzMetrics);
      }
    }
  }

  triggerMetricUpdate() {
    if (this.applicationID) {
      if (this.latestClazzMetrics !== null) {
        this.trigger('newSelectedMetric', this.selectedMetric);
      }
    }
  }

  toggleLegend() {
    this.set('legendActive', !this.legendActive);
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

  /**
   * Reset all class attribute values to null;
   */
  cleanup() {
    this.set('latestClazzMetrics', null);
    this.set('selectedMetric', null);
    this.set('applicationID', null);
    this.set('currentApplication', null);
    this.set('heatmapActive', false);
    this.set('largestValue', 0);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'heatmap-configuration': HeatmapConfiguration;
  }
}
