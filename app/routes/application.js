import Ember from 'ember';

import ApplicationRouteMixin from 
'ember-simple-auth/mixins/application-route-mixin';

const { Route } = Ember;

export default Route.extend(ApplicationRouteMixin, {

navbarService: Ember.inject.service('navbar-labels'),

actions: {
    logout() {
      this.get('session').invalidate();
    }      
  }

});