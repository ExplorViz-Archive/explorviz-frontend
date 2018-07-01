import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  tagName: '',

  fileDownloader: service('file-downloader'),
  landscapeRepo: service("repos/landscape-repository"),

  // to be passed via template
  urlPath: null,
  fileName: null,

  actions: {
    //download currentLandscape from backend server, the returned file is base64 encoded
    downloadFile(){
      this.get('fileDownloader').downloadFile(this.get('urlPath'), this.get('fileName'));
    }
  }
});
