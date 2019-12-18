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
export default class PageSetup extends Service {

  /**
  * Latest fetched entity
  *
  * @property navbarRoutes
  * @type Array
  */
  navbarRoutes:string[] = [];

  /**
  * Latest fetched entity
  *
  * @property navbarOcticons
  * @type Array
  */
 navbarOcticons = null;

  init() {
    super.init();
    // TODO: replay button not shown until implemented
    this.set('navbarRoutes', ["visualization", "discovery", "replay"]);
    this.set('navbarOcticons', []);
  }
}

declare module "@ember/service" {
  interface Registry {
    "page-setup": PageSetup;
  }
}