import DS from 'ember-data';

const { attr, Model } = DS;

export default class ClazzMetric extends Model {
  @attr('string') clazzName!: string;

  @attr('number') value!: number;
}
