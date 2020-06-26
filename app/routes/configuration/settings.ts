import { inject as service } from '@ember/service';
import CurrentUser from 'explorviz-frontend/services/current-user';
import BaseRoute from '../base-route';

export default class ConfigurationSettingsRoute extends BaseRoute {
  @service('current-user')
  currentUser!: CurrentUser;

  model(this: ConfigurationSettingsRoute) {
    const user = this.get('currentUser').get('user');
    return {
      user,
    };
  }
}
