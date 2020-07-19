import DS from 'ember-data';
import ClazzMetric from './clazz-metric';

const { attr, hasMany, Model } = DS;

export default class ApplicationMetric extends Model {
  @attr('string') metricType!: string;

  @attr('number') largestValue!: number;

  @hasMany('clazzMetric') classMetricValues!: DS.PromiseManyArray<ClazzMetric>;

  getClassMetricValues() {
    const classMetrics: Map<string, number> = new Map();
    this.get('classMetricValues').forEach((element) => {
      classMetrics.set(element.clazzName, element.value);
    });

    return classMetrics;
  }
}
