import BaseModel from './base-model';
import DS from 'ember-data';

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
export default class Agent extends BaseModel.extend({

  ip: attr("string"),
  port: attr("string"),

  procezzes: hasMany("procezz")

}) {}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'agent': Agent;
	}
}