import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';

const { attr, belongsTo, hasMany } = DS;

/**
* Ember model for an Application.
*
* @class Application-Model
* @extends DrawNodeEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default DrawNodeEntity.extend({

  name: attr('string'),
  lastUsage: attr('number'),
  programmingLanguage: attr('string'),

  parent: belongsTo('node', {
    inverse: 'applications'
  }),

  components: hasMany('component', {
    // breaks Ember, maybe because of circle ?
    //inverse: 'belongingApplication'
  }),

  databaseQueries: hasMany('databasequery'),

  outgoingApplicationCommunications: hasMany('applicationcommunication', {
    inverse: 'sourceApplication'
  }),

  // list of clazzCommunication for rendering purposes
  outgoingClazzCommunications: hasMany('clazzcommunication', {
    inverse: null
  }),

  // used for text labeling performance in respective renderers
  state: "application",

  unhighlight() {
    this.get('components').forEach((component) => {
      component.unhighlight();
    });
  },

  contains(emberEntity) {
    let found = false;

    this.get('components').forEach((component) => {
      found = component.contains(emberEntity);
    });

    return found;
  },

  filterComponents(attributeString, predicateValue) {
    const filteredComponents = [];

    this.get('components').forEach((component) => {
      if(component.get(attributeString) === predicateValue) {
        filteredComponents.push(component);
      }
    });

    return filteredComponents;
  }

});
