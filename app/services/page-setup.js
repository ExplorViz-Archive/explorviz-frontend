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
  * @property navbarOcticons
  * @type Array
  */
 navbarOcticons: null,

  init() {
    this._super(...arguments);
    // TODO: replay button not shown until implemented
    this.set('navbarRoutes', ["visualization", "discovery"]);
    this.set('navbarOcticons', []);
  }
});
