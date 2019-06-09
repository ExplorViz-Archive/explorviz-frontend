import BaseRoute from 'explorviz-frontend/routes/base-route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
// @ts-ignore
import Constrainable from 'ember-route-constraints/mixins/constrainable';
import {inject as service} from '@ember/service';
import CurrentUser from 'explorviz-frontend/services/current-user';

export default class ConfigurationUserManagementRoute extends BaseRoute.extend(AuthenticatedRouteMixin, Constrainable) {
  //used for route constraints
  @service('current-user')
  currentUser!: CurrentUser;
}
