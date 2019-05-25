import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";

export default class NavbarAdvanced extends Component {

  // No Ember generated container
  tagName = '';

  @service('session')
  session: any;

  @computed()
  get username(this:NavbarAdvanced){
    return this.get('session').get('session.content.authenticated.user.username');
  }
}
