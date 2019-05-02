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

  // @ts-ignore
  @attr("number") pid!: number;

  // @ts-ignore
  @attr("string") osExecutionCommand!: string;

  // @ts-ignore
  @attr("string") agentExecutionCommand!: string;

  // @ts-ignore
  @attr("string") proposedExecutionCommand!: string;

  // @ts-ignore
  @attr("string") workingDirectory!: string;

  // @ts-ignore
  @attr("string") programmingLanguage!: string;

  // @ts-ignore
  @attr("boolean") wasFoundByBackend!: boolean;

  // @ts-ignore
  @belongsTo("agent") agent!: DS.PromiseObject<Agent> & Agent;

  // the following attribute can be changed by users

  // @ts-ignore
  @attr("string") userExecutionCommand!: string;

  // @ts-ignore
  @attr("string") shutdownCommand!: string;

  // @ts-ignore
  @attr("boolean") monitoredFlag!: boolean;

  // @ts-ignore
  @attr("boolean") webserverFlag!: boolean;

  // @ts-ignore
  @attr("boolean") stopped!: boolean;

  // @ts-ignore
  @attr("boolean") restart!: boolean;

  // @ts-ignore
  @attr("string") aopContent!: string;

  // @ts-ignore
  @attr("string") kiekerConfigContent!: string;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'procezz': Procezz;
  }
}