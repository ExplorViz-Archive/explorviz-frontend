import DS from 'ember-data';
import Metric from './metric';
import ApplicationMetricCollection from './application-metric-collection';
import ApplicationMetric from './application-metric';

const { attr, hasMany, Model } = DS;

export default class LandscapeMetric extends Model {
  @attr('number') timestamp!: number;

  @attr('string') landscapeId!: string;

  @hasMany('metric', { polymorphic: true })
  metrics!: DS.PromiseManyArray<Metric>;

  @hasMany('applicationMetricCollection')
  applicationMetricCollections!: DS.PromiseManyArray<ApplicationMetricCollection>;

  getApplicationMetricCollectionById(applicationId: string) {
    let appCollection: ApplicationMetricCollection|undefined;
    this.get('applicationMetricCollections').forEach((tmpCollection) => {
      if (!appCollection && tmpCollection.get('appId') === applicationId) {
        appCollection = tmpCollection;
      }
    });
    return appCollection;
  }

  getApplicationMetric(applicationId: string, metricType: string) {
    const appCollection = this.getApplicationMetricCollectionById(applicationId);

    let appMetrics: ApplicationMetric|undefined;
    appCollection?.get('metricValues').forEach((tmpMetric) => {
      if (!appMetrics && tmpMetric.get('metricType') === metricType) {
        appMetrics = tmpMetric;
      }
    });
    return appMetrics;
  }
}
