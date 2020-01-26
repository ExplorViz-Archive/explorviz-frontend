import { observes } from '@ember-decorators/object';
import Controller from '@ember/controller';
import { action, computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import PlotlyTimeline from 'explorviz-frontend/components/visualization/page-setup/timeline/plotly-timeline';
import Timestamp from 'explorviz-frontend/models/timestamp';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import LandscapeListener from 'explorviz-frontend/services/landscape-listener';
import ReloadHandler from 'explorviz-frontend/services/reload-handler';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import TimestampRepository from 'explorviz-frontend/services/repos/timestamp-repository';

/**
 * TODO
 *
 * @class Visualization-Controller
 * @extends Ember.Controller
 *
 * @module explorviz
 * @submodule visualization
 */
export default class VisualizationController extends Controller {
  @service('rendering-service') renderingService!: RenderingService;
  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;
  @service('landscape-listener') landscapeListener!: LandscapeListener;
  @service('additional-data') additionalData!: AdditionalData;
  @service('repos/timestamp-repository') timestampRepo!: TimestampRepository;
  @service('reload-handler') reloadHandler!: ReloadHandler;

  state = null;

  type = 'landscape';

  plotlyTimelineRef!: PlotlyTimeline;

  selectedTimestampRecords: Timestamp[] = [];

  @observes('landscapeListener.pauseVisualizationReload')
  timelineResetObserver() {
    // reset highlighting and selection in timeline, if unpause was clicked
    if (!get(this.landscapeListener, 'pauseVisualizationReload')) {
      set(this, 'selectedTimestampRecords', []);
      get(this, 'plotlyTimelineRef').resetHighlighting();
    }
  }

  @computed('landscapeRepo.latestApplication')
  get showLandscape() {
    return !get(this.landscapeRepo, 'latestApplication');
  }

  @action
  resize() {
    get(this, 'renderingService').resizeCanvas();
  }

  @action
  resetView() {
    get(this, 'renderingService').reSetupScene();
    get(this, 'plotlyTimelineRef').continueTimeline(get(this, 'selectedTimestampRecords'));
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
  timelineClicked(timestampRecordArray: Timestamp[]) {
    set(this, 'selectedTimestampRecords', timestampRecordArray);
    get(this, 'reloadHandler').loadLandscapeById(timestampRecordArray[0].get('timestamp'));
  }

  @action
  getTimelineReference(plotlyTimelineRef: PlotlyTimeline) {
    // called from within the plotly timeline component
    set(this, 'plotlyTimelineRef', plotlyTimelineRef);
  }

  showTimeline() {
    set(this.renderingService, 'showTimeline', true);
  }

  hideVersionbar() {
    set(this.renderingService, 'showVersionbar', false);
  }

  initRendering() {
    get(this, 'landscapeListener').initSSE();
  }

  // @Override
  cleanup() {
    this._super(...arguments);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  // tslint:disable-next-line: interface-name
  interface Registry {
    'visualizationController': VisualizationController;
  }
}
