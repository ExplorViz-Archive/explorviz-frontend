import Route from '@ember/routing/route';
import ApplicationRouteMixin from 
'ember-simple-auth/mixins/application-route-mixin';


/**
* TODO
* 
* @class Configuration-Route
* @extends Ember.Route
*/
export default Route.extend(ApplicationRouteMixin, {

  actions: {
    didTransition() {
      this.controller.hideTimeline();
    }
  }

});
