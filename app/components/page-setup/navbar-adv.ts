import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import CurrentUser from 'explorviz-frontend/services/current-user';

export default class NavbarAdvanced extends Component {
  @service('current-user')
  currentUser!: CurrentUser;
}
