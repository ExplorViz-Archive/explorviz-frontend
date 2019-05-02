import BaseEntity from './baseentity';
import DS from 'ember-data';

const { attr } = DS;

/**
* Ember model for a DrawNodeEntity.
*
* @class DrawNodeEntity-Model
* @extends BaseEntity-Model
*
* @module explorviz
* @submodule model.util
*/
export default class DrawNodeEntity extends BaseEntity {

  // @ts-ignore
  @attr() plusColor: any;
  // @ts-ignore
  @attr() foregroundColor: any;
  // @ts-ignore
  @attr() backgroundColor: any;

  // @ts-ignore
  @attr('boolean', { defaultValue: false }) highlighted!: boolean;

  // @ts-ignore
  @attr('number', { defaultValue: 0}) width!: number;
  // @ts-ignore
  @attr('number', { defaultValue: 0}) height!: number;
  // @ts-ignore
  @attr('number', { defaultValue: 0}) depth!: number;

  // @ts-ignore
  @attr('number', { defaultValue: 0}) positionX!: number;
  // @ts-ignore
  @attr('number', { defaultValue: 0}) positionY!: number;
  // @ts-ignore
  @attr('number', { defaultValue: 0}) positionZ!: number;

  // @ts-ignore
  @attr()
  threeJSModel: any;

  kielerGraphReference = null;

  sourcePorts = null;
  targetPorts = null;

  init() {
    super.init();
    this.set('sourcePorts', {});
    this.set('targetPorts', {});
  }

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'drawnodeentity': DrawNodeEntity;
  }
}
