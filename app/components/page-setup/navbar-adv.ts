import Component from '@ember/component';
import { inject as service } from "@ember/service";
import CurrentUser from 'explorviz-frontend/services/current-user';

export default class NavbarAdvanced extends Component {

  // No Ember generated container
  tagName = '';

  @service('current-user')
  currentUser!: CurrentUser;
}
