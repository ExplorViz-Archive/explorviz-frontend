import Component from '@glimmer/component';
import { Class } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import HeatmapConfiguration from 'heatmap/services/heatmap-configuration';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

interface Args {
  clazz: Class
}

type AllMetricScoresObject = { metricName: string,
  snapshotVal: number | undefined, contAggVal: number | undefined, winVal: number | undefined };

export default class ClazzPopup extends Component<Args> {
  @service('heatmap-configuration')
  heatmapConf!: HeatmapConfiguration;

  get name() {
    return this.args.clazz.name;
  }

  @computed('heatmapConf.latestClazzMetricScores')
  get allMetrics() {
    const metrics = this.heatmapConf.latestClazzMetricScores;
    const allClassMetricScores: AllMetricScoresObject[] = [];

    // snapshot
    if (metrics) {
      metrics.forEach((metric) => {
        const aggMetrics = this.heatmapConf.aggregatedMetricScores.get(metric.name);

        let winValToShow;

        const winMetrics = this.heatmapConf.differenceMetricScores.get(metric.name);

        if (winMetrics) {
          const newestWinMetricScores = winMetrics[winMetrics?.length - 1];
          winValToShow = newestWinMetricScores.values.get(this.args.clazz.id);
        }

        const newEntry = {
          metricName: metric.name,
          snapshotVal: metric.values.get(this.args.clazz.id),
          contAggVal: aggMetrics?.values.get(this.args.clazz.id),
          winVal: winValToShow,
        };
        allClassMetricScores.push(newEntry);
      });
    }

    return allClassMetricScores;
  }

  @computed('heatmapConf.latestClazzMetricScores')
  get metrics() {
    const metrics = this.heatmapConf.latestClazzMetricScores;
    const classMetrics: { name: string, value: number | undefined }[] = [];

    if (metrics) {
      metrics.forEach((metric) => {
        classMetrics.push({ name: metric.name, value: metric.values.get(this.args.clazz.id) });
      });
    }
    return classMetrics;
  }

  @computed('heatmapConf.aggregatedMetricScores')
  get contAggregatedMetrics() {
    const metrics = this.heatmapConf.aggregatedMetricScores;
    const classMetrics: { name: string, value: number | undefined }[] = [];

    if (metrics) {
      metrics.forEach((metric) => {
        classMetrics.push({ name: metric.name, value: metric.values.get(this.args.clazz.id) });
      });
    }
    return classMetrics;
  }

  @computed('heatmapConf.differenceMetricScores')
  get windowedMetrics() {
    const metrics = this.heatmapConf.differenceMetricScores;
    const classMetrics: { name: string, value: number | undefined }[] = [];

    if (metrics) {
      metrics.forEach((metric) => {
        const newWindowedScores = metric.lastObject;
        if (newWindowedScores) {
          classMetrics.push({
            name: newWindowedScores.name,
            value: newWindowedScores.values.get(this.args.clazz.id),
          });
        }
      });
    }
    return classMetrics;
  }
}
