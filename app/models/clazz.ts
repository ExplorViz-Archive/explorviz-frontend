import DS from 'ember-data';
import ClazzCommunication from './clazzcommunication';
import Component from './component';
import Draw3DNodeEntity from './draw3dnodeentity';

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
  @attr('string') name!: string;

  @attr('string') fullQualifiedName!: string;

  @attr('number', { defaultValue: 0 }) instanceCount!: number;

  @attr() objectIds: any;

  @hasMany('clazzcommunication', { inverse: 'sourceClazz' })
  clazzCommunications!: DS.PromiseManyArray<ClazzCommunication>;

  @belongsTo('component', { inverse: 'clazzes' })
  parent!: DS.PromiseObject<Component> & Component;

  unhighlight() {
    this.set('highlighted', false);
    this.set('state', 'NORMAL');
  }

  openParents(this: Clazz) {
    const parent = this.belongsTo('parent').value() as Component;
    if (parent !== null) {
      parent.set('opened', true);
      parent.openParents();
    }
  }

  closeParents(this: Clazz) {
    const parent = this.belongsTo('parent').value() as Component;
    if (parent !== null) {
      parent.set('opened', false);
      parent.closeParents();
    }
  }

  isVisible() {
    return this.get('parent').get('opened');
  }
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'clazz': Clazz;
  }
}
