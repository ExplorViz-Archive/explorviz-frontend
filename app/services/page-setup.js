import Ember from 'ember';

const {Service} = Ember;

/**
* This service is used to
*
* @class Page-Setup-Service
* @extends Ember.Service
*
* @module explorviz
* @submodule page
*/
export default Service.extend({


  /**
  * Latest fetched entity
  *
  * @property navbarRoutes
  * @type Array
  */
  navbarRoutes:["visualization", "tutorial", "replay", "discovery"],


  /**
  * Latest fetched entity
  *
  * @property navbarGlyphicons
  * @type Array
  */
  navbarGlyphicons:[]
});
