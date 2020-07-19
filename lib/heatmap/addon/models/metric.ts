import DS from 'ember-data';
import LandscapeMetric from './landscape-metric';

const { attr, Model, belongsTo } = DS;

export default class Metric extends Model {
  @attr('string') name!: string;

  @attr('string') typeName!: string;

  @attr('string') description!: string;

  @belongsTo('landscapeMetric', { inverse: 'metrics' })
  parent!: DS.PromiseObject<LandscapeMetric> & LandscapeMetric;
}
