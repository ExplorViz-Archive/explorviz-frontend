import Controller from '@ember/controller';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { inject as service } from "@ember/service";
import { action } from '@ember/object';

export default class Replay extends Controller.extend(AlertifyHandler) {

  @service('current-user') currentUser !: any;
  @service('landscape-file-loader') landscapeFileLoader !: any;

  // necessary for hidded input box to select a file for uploading
  @action triggerSelectBox() {
    let queryBox = document.querySelector("#selectBoxUploadLandscape") as HTMLElement;
    queryBox.click();
  }

  // upload a landscape to the backend
  @action uploadLandscape(evt: any) {
    this.get('landscapeFileLoader').uploadLandscape(evt);
  }

  // download a landscape from the backend
  @action downloadLandscape(timestamp: number, totalRequests: number) {

    const timestamp2: number = 1565348832597;
    const totalRequests2: number = 42;

    this.get('landscapeFileLoader').downloadLandscape(timestamp2, totalRequests2);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'replay': Replay;
  }
}
