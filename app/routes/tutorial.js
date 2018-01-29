import Ember from 'ember';
import AuthenticatedRouteMixin from
 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route } = Ember;

/**
* TODO
*
* @class Tutorial-Route
* @extends Ember.Route
*/
export default Route.extend(AuthenticatedRouteMixin, {

  // BUG
  // not 100% working unloading ember store, related to https://github.com/emberjs/data/issues/4938
  beforeModel() {
    this.store.unloadAll();
    this.store.unloadAll('databasequery');
    this.store.unloadAll('timestamp');
  }

});
