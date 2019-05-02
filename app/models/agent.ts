import BaseModel from './base-model';
import DS from 'ember-data';
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

  // @ts-ignore
  @attr("string") ip!: string;

  // @ts-ignore
  @attr("string") port!: string;

  // @ts-ignore
  @hasMany("procezz") procezzes!: DS.PromiseManyArray<Procezz>;

}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'agent': Agent;
	}
}