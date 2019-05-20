import Component from '@ember/component';
import { action } from '@ember/object';

export default class Navbar extends Component {

  // No Ember generated container
  tagName = '';
  navbarActive = true;

  @action
  toggleNavbar(this: Navbar) {
    this.toggleProperty('navbarActive');
  }

}
