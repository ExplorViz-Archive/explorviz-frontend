import Controller from '@ember/controller';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { inject as service } from "@ember/service";
import { action } from '@ember/object';

export default class Replay extends Controller.extend(AlertifyHandler) {

  @service('current-user') currentUser !: any;
  @service('landscape-file-loader') landscapeFileLoader !: any;
  @service('repos/timestamp-repository') timestampRepo !: any;

  @action timelineClicked(timestampInMillisecondsArray: number) {
    // this.get(this, 'reloadHandler').loadLandscapeById(timestampInMillisecondsArray[0]);
  }

  // necessary for hidded input box to select a file for uploading
  @action triggerSelectBox() {
    let queryBox = document.querySelector("#selectBoxUploadLandscape") as HTMLElement;
    queryBox.click();
  }

  // upload a landscape to the backend
  @action uploadLandscape(evt: any) {
    this.get('landscapeFileLoader').uploadLandscape(evt);
  }

  // fetches replay timestamps from the backend
  @action fetchReplayTimestamps() {
    this.get('timestampRepo').fetchReplayTimestamps();
  }

  // called when on 'setupController() from the replay route
  initController() {
    this.get('fetchReplayTimestamps')();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'replay': Replay;
  }
}
