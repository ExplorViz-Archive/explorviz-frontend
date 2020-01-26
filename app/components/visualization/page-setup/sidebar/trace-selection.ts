
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import DS from 'ember-data';
import Clazz from 'explorviz-frontend/models/clazz';
import Trace from 'explorviz-frontend/models/trace';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import Highlighter from 'explorviz-frontend/services/visualization/application/highlighter';

export type TimeUnit = 'ns' | 'ms' | 's';

export default class TraceSelection extends Component {
  // default time units
  @tracked
  traceTimeUnit: TimeUnit = 'ms';
  @tracked
  traceStepTimeUnit: TimeUnit = 'ms';

  @tracked
  sortBy: any = 'traceId';
  @tracked
  isSortedAsc: boolean = true;
  @tracked
  filterTerm: string = '';
  @tracked
  filterInput: string = '';

  @tracked
  isReplayAnimated: boolean = true;

  @service('store')
  store!: DS.Store;

  @service('additional-data')
  additionalData!: AdditionalData;

  @service('visualization/application/highlighter')
  highlighter!: Highlighter;

  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @service('rendering-service')
  renderingService!: RenderingService;

  // Compute current traces when highlighting changes
  @computed('highlighter.highlightedEntity', 'landscapeRepo.latestApplication', 'sortBy', 'isSortedAsc', 'filterTerm')
  get traces() {
    const highlighter = this.highlighter;
    if (highlighter.get('isTrace')) {
      return [highlighter.get('highlightedEntity')];
    }

    const latestApplication = this.landscapeRepo.latestApplication;
    if (latestApplication === null) {
      return [];
    }

    return this.filterAndSortTraces(latestApplication.get('traces'));
  }

  filterAndSortTraces(this: TraceSelection, traces: DS.PromiseManyArray<Trace>) {
    if (!traces) {
      return [];
    }

    const filteredTraces: Trace[] = [];
    const filter = this.filterTerm;
    traces.forEach((trace) => {
      const sourceClazz = trace.get('sourceClazz');
      const targetClazz = trace.get('targetClazz');
      if (filter === ''
        || trace.get('traceId').includes(filter)
        || (sourceClazz !== undefined && sourceClazz.get('name').toLowerCase().includes(filter))
        || (targetClazz !== undefined && targetClazz.get('name').toLowerCase().includes(filter))) {
        filteredTraces.push(trace);
      }
    });

    if (this.isSortedAsc) {
      filteredTraces.sort((a, b) => (a.get(this.sortBy) > b.get(this.sortBy)) ?
        1 : ((b.get(this.sortBy) > a.get(this.sortBy)) ? -1 : 0));
    } else {
      filteredTraces.sort((a, b) => (a.get(this.sortBy) < b.get(this.sortBy)) ?
        1 : ((b.get(this.sortBy) < a.get(this.sortBy)) ? -1 : 0));
    }

    return filteredTraces;
  }

  @action
  clickedTrace(this: TraceSelection, trace: Trace) {
    if (trace.get('highlighted')) {
      this.highlighter.unhighlightAll();
    } else {
      this.highlighter.highlightTrace(trace);
      this.moveCameraToTraceStep();
    }

    this.renderingService.redrawScene();
  }

  @action
  filter(this: TraceSelection) {
    // Case insensitive string filter
    this.filterTerm = this.filterInput.toLowerCase();
  }

  @action
  selectNextTraceStep(this: TraceSelection) {
    this.highlighter.highlightNextTraceStep();
    this.renderingService.redrawScene();
    if (this.isReplayAnimated) {
      this.moveCameraToTraceStep();
    }
  }

  @action
  selectPreviousTraceStep(this: TraceSelection) {
    this.highlighter.highlightPreviousTraceStep();
    this.renderingService.redrawScene();
    if (this.isReplayAnimated) {
      this.moveCameraToTraceStep();
    }
  }

  @action
  toggleTraceTimeUnit(this: TraceSelection) {
    const timeUnit = this.traceTimeUnit;

    if (timeUnit === 'ns') {
      this.traceTimeUnit = 'ms';
    } else if (timeUnit === 'ms') {
      this.traceTimeUnit = 's';
    } else if (timeUnit === 's') {
      this.traceTimeUnit = 'ns';
    }
  }

  @action
  toggleTraceStepTimeUnit(this: TraceSelection) {
    const timeUnit = this.traceStepTimeUnit;
    if (timeUnit === 'ns') {
      this.traceStepTimeUnit = 'ms';
    } else if (timeUnit === 'ms') {
      this.traceStepTimeUnit = 's';
    } else if (timeUnit === 's') {
      this.traceStepTimeUnit = 'ns';
    }
  }

  @action
  toggleAnimation(this: TraceSelection) {
    this.isReplayAnimated = !this.isReplayAnimated;
  }

  @action
  lookAtClazz(this: TraceSelection, proxyClazz: Clazz) {
    const clazzId = proxyClazz.get('id');
    const clazz = this.store.peekRecord('clazz', clazzId);
    if (clazz !== null) {
      this.renderingService.moveCameraTo(clazz);
    }
  }

  @action
  sortByProperty(this: TraceSelection, property: any) {
    // Determine order for sorting
    if (this.sortBy === property) {
      // Toggle sorting order
      this.isSortedAsc = !this.isSortedAsc;
    } else {
      // Sort in ascending order by default
      this.isSortedAsc = true;
    }

    this.sortBy = property;
  }

  @action
  close(this: TraceSelection) {
    this.additionalData.removeComponent('visualization/page-setup/sidebar/trace-selection');
  }

  moveCameraToTraceStep(this: TraceSelection) {
    const currentTraceStep = this.highlighter.get('currentTraceStep');

    if (currentTraceStep) {
      const storeId = currentTraceStep.get('clazzCommunication').get('id');
      // Avoid proxy object by requesting clazz from store
      const clazzCommunication = this.store.peekRecord('clazzcommunication', storeId);
      if (clazzCommunication !== null) {
        this.renderingService.moveCameraTo(clazzCommunication);
      }
    }
  }

  @action
  onWindowChange(this: TraceSelection) {
    if (!this.additionalData.get('showWindow') && this.highlighter.get('isTrace')) {
      const highlighter = this.highlighter;
      highlighter.unhighlightAll();
      this.renderingService.redrawScene();
    }
  }
}
