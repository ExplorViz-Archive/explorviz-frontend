import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';

const { attr, belongsTo, hasMany } = DS;

export default DrawNodeEntity.extend({

  database: attr('boolean'),

  programmingLanguage: attr('string'),

  lastUsage: attr('number'),

  parent: belongsTo('node'),

  components: hasMany('component'),

  communications: hasMany('communicationclazz')

  //communicationsAccumulated: hasMany('communicationappaccumulator'),

  //incomingCommunications: hasMany('communication'),
  //outgoingCommunications: hasMany('communication'),
  
  //databaseQueries: hasMany('databasequery')

});
