import DS from 'ember-data';
import BaseModel from './base-model';
import Procezz from './procezz';

const { attr, hasMany } = DS;


/**
 * Ember model for a Process. This model is used as an abstraction for
 * distributed processes.
 *
 * TODO more description
 *
 * @class Process-Model
 * @extends BaseModel
 *
 * @module explorviz.extension.discovery
 * @submodule model
 */
export default class Agent extends BaseModel {
  @attr('string') ip!: string;

  @attr('string') port!: string;

  @hasMany('procezz') procezzes!: DS.PromiseManyArray<Procezz>;
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'agent': Agent;
  }
}
