import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';

import { inject as service } from "@ember/service";

export default BaseRoute.extend(AuthenticatedRouteMixin, {

  store: service(),

  model() {
    return this.get('store').queryRecord('usersetting', {});
  },

  actions: {
    goBack() {
      this.transitionTo('configuration.usermanagement.users');
    }
  }
});
