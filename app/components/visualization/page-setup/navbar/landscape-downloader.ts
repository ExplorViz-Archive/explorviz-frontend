import Component from '@ember/component';
import { inject as service } from "@ember/service";
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import LandscapeFileLoader from 'explorviz-frontend/services/landscape-file-loader';
import Landscape from 'explorviz-frontend/models/landscape';
import { action } from '@ember/object';

export default class LandscapeDownloader extends Component.extend({}) {
  // No Ember generated container
  tagName = '';

  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;
  @service('landscape-file-loader') landscapeFileLoader!: LandscapeFileLoader;

  @action
  downloadLandscape() {
    const latestLandscape: Landscape = this.get('landscapeRepo').get('latestLandscape');

    if (latestLandscape !== null) {
      var timestamp: number = latestLandscape.get('timestamp').get('timestamp');
      var totalRequests: number = latestLandscape.get('timestamp').get('totalRequests');

      this.get('landscapeFileLoader').downloadLandscape(timestamp, totalRequests);
    }
  }
};
