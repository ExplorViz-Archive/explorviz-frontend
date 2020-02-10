import DS from 'ember-data';
import Component from './component';
import ClazzCommunication from './clazzcommunication';
import BaseEntity from './baseentity';

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
export default class Clazz extends BaseEntity {
  @attr('string') name!: string;

  @attr('string') fullQualifiedName!: string;

  @attr('number', { defaultValue: 0 }) instanceCount!: number;

  @attr() objectIds: any;

  @hasMany('clazzcommunication', { inverse: 'sourceClazz' })
  clazzCommunications!: DS.PromiseManyArray<ClazzCommunication>;

  @belongsTo('component', { inverse: 'clazzes' })
  parent!: DS.PromiseObject<Component> & Component;

  getParent(this: Clazz) {
    return this.belongsTo('parent').value() as Component;
  }
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'clazz': Clazz;
  }
}
