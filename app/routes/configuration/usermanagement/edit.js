import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

import { inject as service } from "@ember/service";

export default BaseRoute.extend(AuthenticatedRouteMixin, AlertifyHandler, {

  store: service(),

  model(params) {
    return this.get('store').findRecord('user', params.user_id);
  },

  actions: {
    // @Override BaseRoute
    resetRoute() {
      this.transitionTo('configuration.usermanagement');
    },

    goBack() {
      this.transitionTo('configuration.usermanagement');
    },

    error(error) {
      let notFound = error === 'not-found' ||
        (error &&
          error.errors &&
          error.errors[0] &&
          error.errors[0].status == 404);

      // routes that can't find models
      if (notFound) {
        this.showAlertifyMessage('Error: User was not found.');
        this.transitionTo('configuration.usermanagement');
      } else {
        return true;
      }
    }
  }
});
