import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { computed, action, get, set } from '@ember/object';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import LandscapeFileLoader from 'explorviz-frontend/services/landscape-file-loader';
import CurrentUser from 'explorviz-frontend/services/current-user';
import TimestampRepository from 'explorviz-frontend/services/repos/timestamp-repository';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import ReloadHandler from 'explorviz-frontend/services/reload-handler';
import AdditionalData from 'explorviz-frontend/services/additional-data';

export default class ReplayController extends Controller {

  @service('current-user') currentUser !: CurrentUser;
  @service('landscape-file-loader') landscapeFileLoader !: LandscapeFileLoader;
  @service('repos/timestamp-repository') timestampRepo !: TimestampRepository
  @service("repos/landscape-repository") landscapeRepo !: LandscapeRepository;
  @service("rendering-service") renderingService !: RenderingService;
  @service("additional-data") additionalData !: AdditionalData;

  @service("reload-handler") reloadHandler !: ReloadHandler;

  state = null;

  @computed('landscapeRepo.replayApplication')
  get showLandscape() {
    return !get(this.landscapeRepo, 'replayApplication');
  }

  @action
  resize() {
    get(this, 'renderingService').resizeCanvas();
  }

  @action
  resetView() {
    get(this, 'renderingService').reSetupScene();
  }

  @action
  openLandscapeView() {
    set(this.landscapeRepo, 'latestApplication', null);
    set(this.landscapeRepo, 'replayApplication', null);
  }

  @action
  toggleTimeline() {
    get(this, 'renderingService').toggleTimeline();
  }

  @action
  timelineClicked(timestampInMillisecondsArray: any) {
    get(this, 'reloadHandler').loadReplayLandscapeByTimestamp(timestampInMillisecondsArray[0]);
  }

  showTimeline() {
    set(this.renderingService, 'showTimeline', true);
  }

  hideVersionbar() {
    set(this.renderingService, 'showVersionbar', false);
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
    'replayController': ReplayController;
  }
}
