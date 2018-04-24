import BaseModel from './base-model';
import DS from 'ember-data';

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
export default BaseModel.extend({

  pid: attr("number"),

  osExecutionCommand: attr("string"),  
  agentExecutionCommand: attr("string"),
  proposedExecutionCommand: attr("string"),
  workingDirectory: attr("string"),
  programmingLanguage: attr("string"),

  agent: belongsTo("agent"),

  // the following attribute can be changed by users

  userExecutionCommand: attr("string"),
  shutdownCommand: attr("string"),

  monitoredFlag: attr("boolean"),
  webserverFlag: attr("boolean"),  

  stopped: attr("boolean"),
  restart: attr("boolean"),

  aopContent: attr("string"),
  kiekerConfigContent: attr("string")

  

});