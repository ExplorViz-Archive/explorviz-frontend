import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';
import DS from 'ember-data';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import Highlighter from 'explorviz-frontend/services/visualization/application/highlighter';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import Trace from 'explorviz-frontend/models/trace';
import Clazz from 'explorviz-frontend/models/clazz';

export type TimeUnit = 'ns' | 'ms' | 's';

export default class TraceSelection extends Component {

  // No Ember generated container
  tagName = '';

  // default time units
  traceTimeUnit: TimeUnit = 'ms';
  traceStepTimeUnit: TimeUnit = 'ms';

  sortBy: any = 'traceId';
  isSortedAsc: boolean = true;
  filterTerm: string = '';
  filterInput: string = '';

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
    let highlighter = this.get('highlighter');
    if (highlighter.get('isTrace')) {
      return [highlighter.get('highlightedEntity')];
    } else {
      const latestApplication = this.get('landscapeRepo').get('latestApplication');
      if (latestApplication === null) {
        return [];
      } else {
        return this.filterAndSortTraces(latestApplication.get('traces'));
      }
    }
  }

  filterAndSortTraces(this: TraceSelection, traces: DS.PromiseManyArray<Trace>) {
    if (!traces) {
      return [];
    }

    let filteredTraces: Trace[] = [];
    let filter = this.get('filterTerm');
    traces.forEach((trace) => {
      let sourceClazz = trace.get('sourceClazz');
      let targetClazz = trace.get('targetClazz');
      if (filter === ''
        || trace.get('traceId').includes(filter)
        || (sourceClazz !== undefined && sourceClazz.get('name').toLowerCase().includes(filter))
        || (targetClazz !== undefined && targetClazz.get('name').toLowerCase().includes(filter))) {
        filteredTraces.push(trace);
      }
    });

    if (this.get('isSortedAsc')) {
      filteredTraces.sort((a, b) => (a.get(this.get('sortBy')) > b.get(this.get('sortBy'))) ? 1 : ((b.get(this.get('sortBy')) > a.get(this.get('sortBy'))) ? -1 : 0));
    } else {
      filteredTraces.sort((a, b) => (a.get(this.get('sortBy')) < b.get(this.get('sortBy'))) ? 1 : ((b.get(this.get('sortBy')) < a.get(this.get('sortBy'))) ? -1 : 0));
    }

    return filteredTraces;
  }

  init() {
    this.get('additionalData').on('showWindow', this, this.onWindowChange);
    super.init();
  }

  actions = {
    clickedTrace(this: TraceSelection, trace: Trace) {
      if (trace.get('highlighted')) {
        this.get('highlighter').unhighlightAll();
      } else {
        this.get('highlighter').highlightTrace(trace);
        this.moveCameraToTraceStep();
      }

      this.get('renderingService').redrawScene();
    },

    filter(this: TraceSelection) {
      // Case insensitive string filter
      this.set('filterTerm', this.get('filterInput').toLowerCase());
    },

    selectNextTraceStep(this: TraceSelection) {
      this.get('highlighter').highlightNextTraceStep();
      this.get('renderingService').redrawScene();
      if (this.get('isReplayAnimated')) {
        this.moveCameraToTraceStep();
      }
    },

    selectPreviousTraceStep(this: TraceSelection) {
      this.get('highlighter').highlightPreviousTraceStep();
      this.get('renderingService').redrawScene();
      if (this.get('isReplayAnimated')) {
        this.moveCameraToTraceStep();
      }
    },

    toggleTraceTimeUnit(this: TraceSelection) {
      let timeUnit = this.get('traceTimeUnit');

      if (timeUnit === 'ns') {
        this.set('traceTimeUnit', 'ms');
      }
      else if (timeUnit === 'ms') {
        this.set('traceTimeUnit', 's');
      }
      else if (timeUnit === 's') {
        this.set('traceTimeUnit', 'ns');
      }
    },

    toggleTraceStepTimeUnit(this: TraceSelection) {
      let timeUnit = this.get('traceStepTimeUnit');
      if (timeUnit === 'ns') {
        this.set('traceStepTimeUnit', 'ms');
      }
      else if (timeUnit === 'ms') {
        this.set('traceStepTimeUnit', 's');
      }
      else if (timeUnit === 's') {
        this.set('traceStepTimeUnit', 'ns');
      }
    },

    toggleAnimation(this: TraceSelection) {
      this.set('isReplayAnimated', !this.get('isReplayAnimated'));
    },

    lookAtClazz(this: TraceSelection, proxyClazz: Clazz) {
      let clazzId = proxyClazz.get('id');
      let clazz = this.get('store').peekRecord('clazz', clazzId);
      if (clazz !== null) {
        this.get('renderingService').moveCameraTo(clazz);
      }
    },

    sortBy(this: TraceSelection, property: any) {
      // Determine order for sorting
      if (this.get('sortBy') === property) {
        // Toggle sorting order
        this.set('isSortedAsc', !this.get('isSortedAsc'));
      } else {
        // Sort in ascending order by default
        this.set('isSortedAsc', true);
      }

      this.set('sortBy', property);
    },

    close(this: TraceSelection) {
      this.get('additionalData').removeComponent("visualization/page-setup/sidebar/trace-selection");
    },
  }

  moveCameraToTraceStep(this: TraceSelection) {
    let currentTraceStep = this.get('highlighter').get('currentTraceStep');

    if (currentTraceStep) {
      let storeId = currentTraceStep.get('clazzCommunication').get('id');
      // Avoid proxy object by requesting clazz from store
      let clazzCommunication = this.get('store').peekRecord('clazzcommunication', storeId);
      if (clazzCommunication !== null) {
        this.get('renderingService').moveCameraTo(clazzCommunication);
      }
    }
  }

  onWindowChange(this: TraceSelection) {
    if (!this.get('additionalData').get('showWindow') && this.get('highlighter').get('isTrace')) {
      let highlighter = this.get('highlighter');
      highlighter.unhighlightAll();
      this.get('renderingService').redrawScene();
    }
  }

}
