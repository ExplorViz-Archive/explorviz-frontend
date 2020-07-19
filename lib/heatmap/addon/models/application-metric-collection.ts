import DS from 'ember-data';
import ApplicationMetric from './application-metric';

const { attr, hasMany, Model } = DS;

export default class ApplicationMetricCollection extends Model {
  @attr('string') appName!: string;

  @attr('string') appId!: string;

  @hasMany('applicationMetric') metricValues!: DS.PromiseManyArray<ApplicationMetric>;
}
