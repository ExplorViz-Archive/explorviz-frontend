import BaseModel from './base-model';
import DS from 'ember-data';
import Agent from './agent';

const { attr, belongsTo } = DS;

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
export default class Procezz extends BaseModel {

  @attr("number") pid!: number;

  @attr("string") osExecutionCommand!: string;

  @attr("string") agentExecutionCommand!: string;

  @attr("string") proposedExecutionCommand!: string;

  @attr("string") workingDirectory!: string;

  @attr("string") programmingLanguage!: string;

  @attr("boolean") wasFoundByBackend!: boolean;

  @belongsTo("agent") agent!: DS.PromiseObject<Agent> & Agent;

  // the following attribute can be changed by users

  @attr("string") userExecutionCommand!: string;

  @attr("string") shutdownCommand!: string;

  @attr("boolean") monitoredFlag!: boolean;

  @attr("boolean") webserverFlag!: boolean;

  @attr("boolean") stopped!: boolean;

  @attr("boolean") restart!: boolean;

  @attr("string") aopContent!: string;

  @attr("string") kiekerConfigContent!: string;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'procezz': Procezz;
  }
}