import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import LandscapeFileLoader from 'explorviz-frontend/services/landscape-file-loader';
import Landscape from 'explorviz-frontend/models/landscape';
import { action } from '@ember/object';

export default class LandscapeDownloader extends Component {

  @service('landscape-file-loader') landscapeFileLoader!: LandscapeFileLoader;

  @action
  downloadLandscape(landscape: Landscape) {
    console.log(landscape)
    if (landscape !== null) {
      var timestamp: number = landscape.timestamp.get('timestamp');
      var totalRequests: number = landscape.timestamp.get('totalRequests');

      this.landscapeFileLoader.downloadLandscape(timestamp, totalRequests);
    }
  }
};
