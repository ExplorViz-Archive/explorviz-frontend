import {inject as service} from '@ember/service';

import BaseRoute from 'explorviz-frontend/routes/base-route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import CurrentUser from 'explorviz-frontend/services/current-user';

export default class ConfigurationSettingsRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {

  @service('current-user')
  currentUser!: CurrentUser;

  model(this:ConfigurationSettingsRoute) {
    let user = this.get('currentUser').get('user');
    return {
      user
    }
  }
}
