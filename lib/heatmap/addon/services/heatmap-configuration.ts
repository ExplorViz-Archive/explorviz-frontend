import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { tracked } from '@glimmer/tracking';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import LandscapeListener from 'explorviz-frontend/services/landscape-listener';
import { getDefaultGradient as getSimpleDefaultGradient } from '../utils/simple-heatmap';
import { getDefaultGradient as getArrayDefaultGradient } from '../utils/array-heatmap';
import revertKey from '../utils/heatmap-generator';

export type Metric = {
  name: string;
  description: string;
  min: number,
  max: number,
  values: Map<string, number>
};

type HeatmapMode = 'snapshotHeatmap' | 'aggregatedHeatmap' | 'windowedHeatmap';

export default class HeatmapConfiguration extends Service.extend(Evented) {
  @service('landscape-listener')
  landscapeListener!: LandscapeListener;

  @tracked
  heatmapActive = false;

  currentApplication: ApplicationObject3D | undefined | null;

  // Switch for the legend
  legendActive = true;

  @tracked
  latestClazzMetricScores: Metric[] | null = null;

  largestValue = 0;

  metrics: Metric[] = [];

  aggregatedMetricScores: Map<string, Metric> = new Map<string, Metric>();

  @tracked
  selectedMetric: Metric | null = null;

  applicationID: string | null = null;

  // Switches and models used by config
  @tracked
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

  saveAndCalculateMetricScores(newScores: Metric[]) {
    // calculate new aggregated metric scores
    newScores.forEach((newMetricScore) => {
      const metricName = newMetricScore.name;
      this.metrics.push(newMetricScore);
      if (newMetricScore.values) {
        // update values
        newMetricScore.values.forEach((value, key) => {
          const oldMetric = this.aggregatedMetricScores.get(metricName);
          const oldMetricScores = oldMetric?.values;

          // Init metrics (first run)
          if (!oldMetric) {
            this.aggregatedMetricScores.set(metricName, newMetricScore);
          } else if (oldMetricScores) {
            // update metric scores (subsequent runs)
            const oldScore = oldMetricScores.get(key);
            if (oldScore) {
              this.aggregatedMetricScores.get(metricName)?.values.set(key, value + 0.5 * oldScore);
            }
          }
        });
      }
    });
  }

  switchMode() {
    switch (this.selectedMode) {
      case 'snapshotHeatmap':
        this.selectedMode = 'aggregatedHeatmap';
        break;
      case 'aggregatedHeatmap':
        this.selectedMode = 'windowedHeatmap';
        break;
      case 'windowedHeatmap':
        this.selectedMode = 'snapshotHeatmap';
        break;
      default:
        this.selectedMode = 'snapshotHeatmap';
        break;
    }
  }

  triggerHeatmapMode() {
    if (this.applicationID) {
      if (this.latestClazzMetricScores !== null) {
        this.trigger('updatedHeatMapMode', this.selectedMode);
      }
    }
  }

  triggerLatestHeatmapUpdate() {
    if (this.applicationID) {
      if (this.latestClazzMetricScores !== null) {
        this.trigger('updatedClazzMetrics', this.latestClazzMetricScores);
      }
    }
  }

  triggerMetricUpdate() {
    if (this.applicationID) {
      if (this.latestClazzMetricScores !== null) {
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
    this.set('latestClazzMetricScores', null);
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
