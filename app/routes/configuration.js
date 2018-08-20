import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';


/**
* TODO
* 
* @class Configuration-Route
* @extends Ember.Route
*/
export default Route.extend(AuthenticatedRouteMixin, {

  actions: {
    didTransition() {
      this.controller.hideTimeline();
    }
  }

});
