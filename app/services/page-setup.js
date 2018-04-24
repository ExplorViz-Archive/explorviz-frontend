import Service from '@ember/service';

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
  navbarRoutes: null,


  /**
  * Latest fetched entity
  *
  * @property navbarGlyphicons
  * @type Array
  */
  navbarGlyphicons: null,

  init() {
    this._super(...arguments);

    this.set('navbarRoutes', ["visualization", "tutorial", "replay", "discovery"]);
    this.set('navbarGlyphicons', []);

  }
});
