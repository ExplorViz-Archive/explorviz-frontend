import Ember from 'ember';
import ApplicationRouteMixin from 
'ember-simple-auth/mixins/application-route-mixin';

const {Route} = Ember;

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
