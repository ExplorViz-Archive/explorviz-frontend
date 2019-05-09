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

  @attr() plusColor: any;
  @attr() foregroundColor: any;
  @attr() backgroundColor: any;

  @attr('boolean', { defaultValue: false }) highlighted!: boolean;

  @attr('number', { defaultValue: 0}) width!: number;
  @attr('number', { defaultValue: 0}) height!: number;
  @attr('number', { defaultValue: 0}) depth!: number;

  @attr('number', { defaultValue: 0}) positionX!: number;
  @attr('number', { defaultValue: 0}) positionY!: number;
  @attr('number', { defaultValue: 0}) positionZ!: number;

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
