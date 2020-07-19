import DS from 'ember-data';
import LandscapeMetric from './landscape-metric';

const { attr, Model, belongsTo } = DS;

/**
 * Ember model for a heatmap.
 */
export default class Heatmap extends Model {
  @attr('number') windowsize!: number;

  @attr('number') timestamp!: number;

  @attr('string') landscapeId!: string;

  @belongsTo('landscapeMetric')
  aggregatedHeatmap!: DS.PromiseObject<LandscapeMetric> & LandscapeMetric;

  @belongsTo('landscapeMetric')
  windowedHeatmap!: DS.PromiseObject<LandscapeMetric> & LandscapeMetric;

  getAggregatedHeatmap() {
    return this.get('aggregatedHeatmap');
  }

  getWindowedHeatmap() {
    return this.get('windowedHeatmap');
  }
}
