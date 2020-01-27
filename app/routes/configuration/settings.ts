import { action } from '@ember/object';
import { inject as service } from '@ember/service';

// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import BaseRoute from 'explorviz-frontend/routes/base-route';
import CurrentUser from 'explorviz-frontend/services/current-user';

export default class ConfigurationSettingsRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {
  @service('current-user')
  currentUser!: CurrentUser;

  model(this: ConfigurationSettingsRoute) {
    const user = this.get('currentUser').get('user');
    return {
      user,
    };
  }

  @action
  // eslint-disable-next-line class-methods-use-this
  resetRoute() {}
}
