import Component from '@ember/component';
import { inject as service } from "@ember/service";
import LandscapeFileLoader from 'explorviz-frontend/services/landscape-file-loader';
import Landscape from 'explorviz-frontend/models/landscape';
import { action } from '@ember/object';

export default class LandscapeDownloader extends Component.extend({}) {
  // No Ember generated container
  tagName = '';

  @service('landscape-file-loader') landscapeFileLoader!: LandscapeFileLoader;

  @action
  downloadLandscape(landscape: Landscape) {
    if (landscape !== null) {
      var timestamp: number = landscape.get('timestamp').get('timestamp');
      var totalRequests: number = landscape.get('timestamp').get('totalRequests');

      this.get('landscapeFileLoader').downloadLandscape(timestamp, totalRequests);
    }
  }
};
