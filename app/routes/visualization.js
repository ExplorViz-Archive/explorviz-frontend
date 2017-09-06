import Ember from 'ember';
import AuthenticatedRouteMixin from
 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route } = Ember;

/**
* TODO
* 
* @class Visualization-Route
* @extends Ember.Route
*/
export default Route.extend(AuthenticatedRouteMixin, {

  actions: {
    didTransition() {
      this.controller.showTimeline();
    }
  }
  
});
