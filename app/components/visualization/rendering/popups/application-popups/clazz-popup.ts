import Component from '@glimmer/component';
import { Class } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import HeatmapConfiguration from 'heatmap/services/heatmap-configuration';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

interface Args {
  clazz: Class
}

export default class ClazzPopup extends Component<Args> {
  @service('heatmap-configuration')
  heatmapConf!: HeatmapConfiguration;

  get name() {
    return this.args.clazz.name;
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
}
