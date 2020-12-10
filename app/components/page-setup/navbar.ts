import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import LandscapeTokenService from 'explorviz-frontend/services/landscape-token';

export default class Navbar extends Component {
  @service('landscape-token')
  tokenService!: LandscapeTokenService;
}
