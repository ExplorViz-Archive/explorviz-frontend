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
  navbarRoutes:string[] = ["visualization", "discovery", "replay"];
}

declare module "@ember/service" {
  interface Registry {
    "page-setup": PageSetup;
  }
}