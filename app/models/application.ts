import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';
import Component from './component';
import Clazz from './clazz';
import DatabaseQuery from './databasequery';
import Trace from './trace';
import ApplicationCommunication from './applicationcommunication';
import AggregatedClazzCommunication from './aggregatedclazzcommunication';
import DrawableClazzCommunication from './drawableclazzcommunication';

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
export default class Application extends DrawNodeEntity {

  @attr('string') name!: string;

  @attr('number') lastUsage!: number;

  @attr('string') programmingLanguage!: string;

  @belongsTo('node', { inverse: 'applications' })
  parent!: DS.PromiseObject<Node> & Node;

  @hasMany('component', {
    // breaks Ember, maybe because of circle ?
    //inverse: 'belongingApplication'
  })
  components!: DS.PromiseManyArray<Component>;

  @hasMany('databasequery')
  databaseQueries!: DS.PromiseManyArray<DatabaseQuery>;

  @hasMany('trace') traces!: DS.PromiseManyArray<Trace>;

  @hasMany('applicationcommunication', { inverse: 'sourceApplication' })
  applicationCommunications!: DS.PromiseManyArray<ApplicationCommunication>;

  // list of aggregated clazzCommunication for rendering purposes
  @hasMany('aggregatedclazzcommunication', { inverse: null })
  aggregatedClazzCommunications!: DS.PromiseManyArray<AggregatedClazzCommunication>;

  // list of aggregated clazzCommunication for rendering purposes
  @hasMany('drawableclazzcommunication', { inverse: null })
  drawableClazzCommunications!: DS.PromiseManyArray<DrawableClazzCommunication>;

  // used for text labeling performance in respective renderers
  state = "application";

  contains(emberEntity: any) {
    let found = false;

    this.get('components').forEach((component) => {
      found = component.contains(emberEntity);
    });

    return found;
  }

  getAllComponents() {
    let components:Component[] = [];

    this.get('components').forEach((component) => {      
      components.push(component);

      const children = component.get('children');
      children.forEach((child: Component) => {
        components.push(child);
        components = components.concat(child.getAllComponents());
      });
    });

    return components;
  }

  getAllClazzes() {
    let clazzes:Clazz[] = [];

    this.get('components').forEach((component) => {
      clazzes = clazzes.concat(component.getAllClazzes());
    });

    return clazzes;
  }

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'application': Application;
  }
}
