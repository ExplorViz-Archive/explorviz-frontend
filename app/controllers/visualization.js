import Controller from '@ember/controller';
import { inject as service } from '@ember/service'; 
import { computed, action, get, set, observer } from '@ember/object';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

/**
* TODO
*
* @class Visualization-Controller
* @extends Ember.Controller
*
* @module explorviz
* @submodule visualization
*/
export default class VisualizationController extends Controller.extend(AlertifyHandler, {

  // @Override
  init(){
    this._super(...arguments);

    // must be called once, so that observer works
    get(this, 'landscapeListener');
  },

  timelineResetObserver: observer('landscapeListener.pauseVisualizationReload', function() {
    if(!get(this, "landscapeListener.pauseVisualizationReload")) {      
      get(this, 'plotlyTimelineRef').resetHighlighting();
    }
  })

}) {

  @service("rendering-service") renderingService;
  @service("repos/landscape-repository") landscapeRepo;
  @service("landscape-listener") landscapeListener;
  @service("additional-data") additionalData;
  @service("repos/timestamp-repository") timestampRepo;
  @service("reload-handler") reloadHandler;

  state = null;

  type = 'landscape';

  plotlyTimelineRef = null;

  

  @computed('landscapeRepo.latestApplication')
  get showLandscape() {
    return !get(this, 'landscapeRepo.latestApplication');
  }

  @action
  resize() {
    get(this, 'renderingService').resizeCanvas();
  }

  @action
  resetView() {
    get(this, 'renderingService').reSetupScene();
    get(this, 'plotlyTimelineRef').continueTimeline();
  }

  @action
  openLandscapeView() {
    set(this, 'landscapeRepo.latestApplication', null);
    set(this, 'landscapeRepo.replayApplication', null);
  }

  @action
  toggleTimeline() {
    get(this, 'renderingService').toggleTimeline();
  }

  @action
  timelineClicked(timestampInMillisecondsArray) {
    get(this, 'reloadHandler').loadLandscapeById(timestampInMillisecondsArray[0]);
  }

  @action
  getTimelineReference(plotlyTimelineRef) {
    set(this, 'plotlyTimelineRef', plotlyTimelineRef);
  }

  showTimeline() {
    set(this, 'renderingService.showTimeline', true);
  }

  hideVersionbar(){
    set(this, 'renderingService.showVersionbar', false);
  }

  initRendering() {
    get(this, 'landscapeListener').initSSE();
  }

  // @Override
  cleanup() {
    this._super(...arguments);
  }
}
