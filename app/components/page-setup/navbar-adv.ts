import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import CurrentUser from 'explorviz-frontend/services/current-user';
import Auth from 'explorviz-frontend/services/auth';

export default class NavbarAdvanced extends Component {
  @service('current-user')
  currentUser!: CurrentUser;

  @service('auth')
  auth!: Auth;

  @action
  logout() {
    this.auth.logout();
  }
}
