
// eslint-disable-next-line import/no-extraneous-dependencies
import { observes } from '@ember-decorators/object';
import Controller from '@ember/controller';
import {
  action,
  computed,
  get,
  set,
} from '@ember/object';
import { inject as service } from '@ember/service';
import PlotlyTimeline from 'explorviz-frontend/components/visualization/page-setup/timeline/plotly-timeline';
import Timestamp from 'explorviz-frontend/models/timestamp';
import LandscapeListener from 'explorviz-frontend/services/landscape-listener';
import ReloadHandler from 'explorviz-frontend/services/reload-handler';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import TimestampRepository from 'explorviz-frontend/services/repos/timestamp-repository';
import { tracked } from '@glimmer/tracking';

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
  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  @service('landscape-listener') landscapeListener!: LandscapeListener;

  @service('repos/timestamp-repository') timestampRepo!: TimestampRepository;

  @service('reload-handler') reloadHandler!: ReloadHandler;

  state = null;

  type = 'landscape';

  plotlyTimelineRef!: PlotlyTimeline;

  selectedTimestampRecords: Timestamp[] = [];

  @tracked
  showDataSelection = false;

  @tracked
  components: string[] = [];

  @tracked
  showTimeline: boolean = true;

  // eslint-disable-next-line ember/no-observers
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
  resetView() {
    get(this, 'plotlyTimelineRef').continueTimeline(get(this, 'selectedTimestampRecords'));
  }

  @action
  openLandscapeView() {
    set(this.landscapeRepo, 'latestApplication', null);
    set(this.landscapeRepo, 'replayApplication', null);
  }

  @action
  closeDataSelection() {
    this.showDataSelection = false;
    this.components = [];
  }

  @action
  addComponent(component: string) {
    if (this.components.includes(component)) {
      // remove it and readd it in the code below,
      // so it again appears on top inside the sidebar
      // This will not reset the component
      this.removeComponent(component);
    }

    this.components = [component, ...this.components];
    this.showDataSelection = true;
  }

  @action
  removeComponent(path: string) {
    if (this.components.length === 0) { return; }

    const index = this.components.indexOf(path);
    // Remove existing sidebar component
    if (index !== -1) {
      const components = [...this.components];
      components.splice(index, 1);
      this.components = components;
    }

    // Close sidebar if it would be empty otherwise
    if (this.components.length === 0) {
      this.showDataSelection = false;
    }
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

  @action
  toggleTimeline() {
    this.showTimeline = !this.showTimeline;
  }

  initRendering() {
    get(this, 'landscapeListener').initSSE();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  // tslint:disable-next-line: interface-name
  interface Registry {
    'visualizationController': VisualizationController;
  }
}
