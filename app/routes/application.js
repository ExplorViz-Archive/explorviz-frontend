import Ember from 'ember';

import ApplicationRouteMixin from 
'ember-simple-auth/mixins/application-route-mixin';

// ApplicationRouteMixin => transition all pages to login if not authenticated
export default Ember.Route.extend(ApplicationRouteMixin, {

  session: Ember.inject.service('session'),

  // transition to login route from main-page
  beforeModel() {
    this.transitionTo('login');
  },

  actions: {
    invalidateSession: function() {
      this.get('session').invalidate();
    }
  }
});