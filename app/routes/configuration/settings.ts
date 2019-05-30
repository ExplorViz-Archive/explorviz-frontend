import {inject as service} from '@ember/service';

import BaseRoute from 'explorviz-frontend/routes/base-route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ConfigurationSettingsRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {

  @service('session')
  session: any;

  model(this:ConfigurationSettingsRoute) {
    let user = this.get('session.session.content.authenticated.user');
    return {
      user
    }
  }
}
