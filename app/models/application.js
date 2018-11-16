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

  // list of aggregated clazzCommunication for rendering purposes
  aggregatedOutgoingClazzCommunications: hasMany('aggregatedclazzcommunication', {
    inverse: null
  }),

  // list of aggregated clazzCommunication for rendering purposes
  cumulatedClazzCommunications: hasMany('cumulatedclazzcommunication', {
    inverse: null
  }),

  // used for text labeling performance in respective renderers
  state: "application",

  unhighlight() {
    this.get('components').forEach((component) => {
      component.unhighlight();
    });
    this.get('cumulatedClazzCommunications').forEach((communication) => {
      communication.unhighlight();
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
  },

  applyDefaultOpenLayout(userAlreadyActed) {
    // opens all components until at least two entities are on the same level

    if(userAlreadyActed) {
      return;
    }
    
    const components = this.get('components');

    if(components.length > 1) {
      // there are two components on the first level
      // therefore, here is nothing to do
      return;
    }

    if(components.objectAt(0)) {
      components.objectAt(0).applyDefaultOpenLayout();
    }    
  }

});
