import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';

const { attr, belongsTo, hasMany } = DS;

/**
* Ember model for an Application.
* 
* @class Application
* @extends DrawNodeEntity
*/
export default DrawNodeEntity.extend({

  database: attr('boolean'),

  programmingLanguage: attr('string'),

  lastUsage: attr('number'),

  parent: belongsTo('node'),

  components: hasMany('component'),

  communications: hasMany('communicationclazz'),

  //communicationsAccumulated: hasMany('communicationappaccumulator'),

  // incomingCommunications: hasMany('communication', {
  //   inverse: 'source'
  // }),

  // outgoingCommunications: hasMany('communication', {
  //   inverse: 'target'
  // }),
  // 
  incomingCommunications: null,
  outgoingCommunications: null,
  
  //databaseQueries: hasMany('databasequery')

  backgroundColor: attr(),

  // used for text labeling performance in respective renderers
  state: "application"

});
