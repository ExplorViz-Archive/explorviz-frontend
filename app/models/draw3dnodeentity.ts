import { computed } from '@ember/object';
import DS from 'ember-data';
import THREE from 'three';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
 * Ember model for a Draw3DNodeEntity. This model is inherited by all elements
 * that compose an application in the respective visualization.
 *
 * @class Draw3DNodeEntity-Model
 * @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model.util
 */
export default class Draw3DNodeEntity extends BaseEntity {
  @attr('number', { defaultValue: 0 }) width!: number;

  @attr('number', { defaultValue: 0 }) height!: number;

  @attr('number', { defaultValue: 0 }) depth!: number;

  @attr('number', { defaultValue: 0 }) positionX!: number;

  @attr('number', { defaultValue: 0 }) positionY!: number;

  @attr('number', { defaultValue: 0 }) positionZ!: number;

  @attr('boolean', { defaultValue: false }) highlighted!: boolean;

  @attr('boolean', { defaultValue: false }) opened!: boolean;

  @attr('boolean', { defaultValue: true }) visible!: boolean;

  @computed('width', 'height', 'depth')
  get extension() {
    const width = this.get('width') / 2.0;
    const height = this.get('height') / 2.0;
    const depth = this.get('depth') / 2.0;

    return new THREE.Vector3(width, height, depth);
  }

  // used to mark entities as transparent or normal for highlighting
  @attr('string', { defaultValue: 'NORMAL' })
  state!: string;

  highlight() {
    this.set('highlighted', true);
  }

  threeJSModel!: THREE.Mesh;
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'draw3dnodeentity': Draw3DNodeEntity;
  }
}
