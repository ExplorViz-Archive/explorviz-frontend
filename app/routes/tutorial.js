import BaseRoute from './base-route';
import AuthenticatedRouteMixin from
 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
* TODO
*
* @class Tutorial-Route
* @extends Ember.Route
*/
export default BaseRoute.extend(AuthenticatedRouteMixin, {

  // BUG
  // not 100% working unloading ember store, related to https://github.com/emberjs/data/issues/4938
  beforeModel() {
    this.store.unloadAll();
    this.store.unloadAll('databasequery');
    this.store.unloadAll('timestamp');
  }

});
