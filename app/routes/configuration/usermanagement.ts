import BaseRoute from 'explorviz-frontend/routes/base-route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
// @ts-ignore
import Constrainable from 'ember-route-constraints/mixins/constrainable';
import {inject as service} from '@ember/service';
import { computed } from '@ember/object';

export default class ConfigurationUserManagementRoute extends BaseRoute.extend(AuthenticatedRouteMixin, Constrainable) {
  @service('session')
  session: any;

  @computed()
  get currentUser(this:ConfigurationUserManagementRoute) {
    return this.get('session.session.content.authenticated.user');
  }
}
