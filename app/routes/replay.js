import BaseRoute from './base-route';
import AuthenticatedRouteMixin from
 'ember-simple-auth/mixins/authenticated-route-mixin';
 import Ember from 'ember';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  renderingService: Ember.inject.service("rendering-service"),

  actions: {
    didTransition() {
      this.set('renderingService.showTimeline', false);
      this.set('renderingService.showVersionbar', true);
    }
  }
});
