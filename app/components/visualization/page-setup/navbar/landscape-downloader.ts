import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Landscape from 'explorviz-frontend/models/landscape';
import LandscapeFileLoader from 'explorviz-frontend/services/landscape-file-loader';

export default class LandscapeDownloader extends Component {
  @service('landscape-file-loader') landscapeFileLoader!: LandscapeFileLoader;

  @action
  downloadLandscape(landscape: Landscape) {
    if (landscape !== null) {
      const timestamp: number = landscape.timestamp.get('timestamp');
      const totalRequests: number = landscape.timestamp.get('totalRequests');

      this.landscapeFileLoader.downloadLandscape(timestamp, totalRequests);
    }
  }
}
