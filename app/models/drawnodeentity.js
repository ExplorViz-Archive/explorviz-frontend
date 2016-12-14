import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

export default BaseEntity.extend({

  name: attr('string')

});
