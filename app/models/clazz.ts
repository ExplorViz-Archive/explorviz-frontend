import DS from 'ember-data';
import Draw3DNodeEntity from './draw3dnodeentity';
import Component from './component';
import ClazzCommunication from './clazzcommunication';

const { attr, belongsTo, hasMany } = DS;

/**
* Ember model for a clazz.
*
* @class Clazz-Model
* @extends Draw3DNodeEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default class Clazz extends Draw3DNodeEntity {

  // @ts-ignore
  @attr('string') name!: string;
  // @ts-ignore
  @attr('string') fullQualifiedName!: string;

  // @ts-ignore
  @attr('number', {defaultValue: 0}) instanceCount!: number;

  // @ts-ignore
  @attr() objectIds: any;

  // @ts-ignore
  @hasMany('clazzcommunication', { inverse: 'sourceClazz' })
  clazzCommunications!: DS.PromiseManyArray<ClazzCommunication>;

  // @ts-ignore
  @belongsTo('component', { inverse: 'clazzes' })
  parent!: DS.PromiseObject<Component> & Component;

  unhighlight() {
    this.set('highlighted', false);
    this.set('state', 'NORMAL');
  }

  openParents(this: Clazz) {
    let parent = this.belongsTo('parent').value() as Component;
    if(parent !== null) {
      parent.set('opened', true);
      parent.openParents();
    }
  }

  isVisible() {
    return this.get('parent').get('opened');
  }

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'clazz': Clazz;
  }
}
