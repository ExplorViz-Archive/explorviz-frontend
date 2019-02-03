import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  actions: {
    goBack() {
      this.transitionTo('configuration.usermanagement.users');
    }
  }
});
