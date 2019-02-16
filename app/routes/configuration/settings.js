import {inject as service} from '@ember/service';

import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  session: service(),

  model() {
    return this.get('session.session.content.authenticated.user');
  }
});
