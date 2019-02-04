import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';

import Constrainable from 'ember-route-constraints/mixins/constrainable';
import {inject as service} from '@ember/service';
import { computed } from '@ember/object';

export default BaseRoute.extend(AuthenticatedRouteMixin, Constrainable, {
  session: service(),

  currentUser: computed(function() {
    return this.get('session.session.content.authenticated.user');
  })
});
