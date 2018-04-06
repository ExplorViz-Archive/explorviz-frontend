import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import BaseModel from './base-model';


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

  ip: attr("string"),
  port: attr("string"),

  procezzes: hasMany("procezz")

});