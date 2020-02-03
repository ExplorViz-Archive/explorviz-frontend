import {inject as service} from '@ember/service';

import Route from '@ember/routing/route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import CurrentUser from 'explorviz-frontend/services/current-user';

export default class ConfigurationSettingsRoute extends Route.extend(AuthenticatedRouteMixin) {

  @service('current-user')
  currentUser!: CurrentUser;

  model(this:ConfigurationSettingsRoute) {
    let user = this.get('currentUser').get('user');
    return {
      user
    }
  }
}
