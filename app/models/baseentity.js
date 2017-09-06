import DS from 'ember-data';

const {Model} = DS;

/**
* Ember model for a BaseEntity. Every element of ExplorViz's Meta-Model should 
* inherit this class, since it might change and contain some useful data at 
* some point. 
* 
* @class BaseEntity-Model
* @extends DS.Model
*/
export default Model.extend({});
