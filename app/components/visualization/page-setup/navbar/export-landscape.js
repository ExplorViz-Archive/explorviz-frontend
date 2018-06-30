import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  tagName: '',

  fileDownloader: service('file-downloader'),
  landscapeRepo: service("repos/landscape-repository"),

  actions: {
    //download currentLandscape from backend server, the returned file is base64 encoded
    exportLandscape(){
      const currentLandscape = this.get('landscapeRepo.latestLandscape');
      const currentTimestamp = currentLandscape.get('timestamp');
      const currentCalls = currentLandscape.get('overallCalls');

      const urlPath = `/landscape/export/${currentTimestamp}`;
      const fileName = `${currentTimestamp}-${currentCalls}.expl`;

      this.get('fileDownloader').downloadFile(urlPath, fileName);
    }
  }
});
