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
    //download file from backend server
    downloadFile(){
      this.get('fileDownloader').downloadFile(this.get('urlPath'), this.get('fileName'));
    }
  }
});
