import Controller from '@ember/controller';
import { inject as service } from '@ember/service'; 
import { computed, action, get, set, observer } from '@ember/object';

/**
* TODO
*
* @class Visualization-Controller
* @extends Ember.Controller
*
* @module explorviz
* @submodule visualization
*/
export default class VisualizationController extends Controller.extend({

  // eslint-disable-next-line ember/no-observers
  timelineResetObserver: observer('landscapeListener.pauseVisualizationReload', function() {
    // reset highlighting and selection in timeline, if unpause was clicked
    if(!get(this, "landscapeListener.pauseVisualizationReload")) {
      set(this, "selectedTimestampRecords", []);
      get(this, 'plotlyTimelineRef').resetHighlighting();
    }
  })

}) 
{

  @service("rendering-service") renderingService;
  @service("repos/landscape-repository") landscapeRepo;
  @service("landscape-listener") landscapeListener;
  @service("additional-data") additionalData;
  @service("repos/timestamp-repository") timestampRepo;
  @service("reload-handler") reloadHandler;

  state = null;

  type = 'landscape';

  plotlyTimelineRef = null;

  selectedTimestampRecords = [];

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
    get(this, 'plotlyTimelineRef').continueTimeline(get(this, "selectedTimestampRecords"));
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
  timelineClicked(timestampRecordArray) {
    set(this, "selectedTimestampRecords", timestampRecordArray);
    get(this, 'reloadHandler').loadLandscapeById(timestampRecordArray[0].get("timestamp"));
  }

  @action
  getTimelineReference(plotlyTimelineRef) {
    // called from within the plotly timeline component
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
