import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import DS from 'ember-data';
import Clazz from 'explorviz-frontend/models/clazz';
import Trace from 'explorviz-frontend/models/trace';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import TraceStep from 'explorviz-frontend/models/tracestep';
import ClazzCommunication from 'explorviz-frontend/models/clazzcommunication';
import * as Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';

export type TimeUnit = 'ns' | 'ms' | 's';

interface Args {
  applicationObject3D: ApplicationObject3D,
  removeComponent(componentPath: string): void,
  highlightTrace(trace: Trace, traceStep: number): void,
  moveCameraTo(emberModel: Clazz|ClazzCommunication): void,
}

export default class TraceSelection extends Component<Args> {
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

  @tracked
  selectedTrace: Trace|null = null;

  @tracked
  currentTraceStep: TraceStep|null = null;

  @service('store')
  store!: DS.Store;

  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  // Compute current traces when highlighting changes
  @computed('landscapeRepo.latestApplication', 'args.applicationObject3D.highlightedEntity', 'sortBy', 'isSortedAsc', 'filterTerm')
  get traces() {
    // Only show highlighted trace and set highlighting status accordingly
    const maybeTrace = this.args.applicationObject3D.highlightedEntity;
    if (maybeTrace instanceof Trace) {
      this.selectedTrace = maybeTrace;
      return [maybeTrace];
    }

    // Reset selected trace
    this.selectedTrace = null;

    const { latestApplication } = this.landscapeRepo;
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
      filteredTraces.sort((a, b) => {
        if (a.get(this.sortBy) > b.get(this.sortBy)) {
          return 1;
        }
        if (b.get(this.sortBy) > a.get(this.sortBy)) {
          return -1;
        }
        return 0;
      });
    } else {
      filteredTraces.sort((a, b) => {
        if (a.get(this.sortBy) < b.get(this.sortBy)) {
          return 1;
        }
        if (b.get(this.sortBy) < a.get(this.sortBy)) {
          return -1;
        }
        return 0;
      });
    }

    return filteredTraces;
  }

  @action
  clickedTrace(this: TraceSelection, trace: Trace) {
    // Reset highlighting when highlighted trace is clicked again
    if (trace === this.selectedTrace) {
      this.selectedTrace = null;
      Highlighting.removeHighlighting(this.args.applicationObject3D);
      return;
    }

    this.selectedTrace = trace;

    const traceSteps = trace.hasMany('traceSteps').value();
    this.currentTraceStep = traceSteps?.objectAt(0);

    this.args.highlightTrace(trace, 1);
  }

  @action
  filter(this: TraceSelection) {
    // Case insensitive string filter
    this.filterTerm = this.filterInput.toLowerCase();
  }

  @action
  selectNextTraceStep(this: TraceSelection) {
    // Can only select next step if a trace is selected
    if (!this.currentTraceStep || !this.selectedTrace) {
      return;
    }

    const nextStepPosition = this.currentTraceStep.tracePosition + 1;

    if (nextStepPosition > this.selectedTrace.length) {
      return;
    }

    const traceSteps = this.selectedTrace.hasMany('traceSteps').value();
    this.currentTraceStep = traceSteps?.objectAt(nextStepPosition - 1);

    this.args.highlightTrace(this.selectedTrace, nextStepPosition);

    const clazzCommunication = this.currentTraceStep?.belongsTo('clazzCommunication').value() as ClazzCommunication;

    if (this.isReplayAnimated && clazzCommunication) {
      this.args.moveCameraTo(clazzCommunication);
    }
  }

  @action
  selectPreviousTraceStep(this: TraceSelection) {
    // Can only select next step if a trace is selected
    if (!this.selectedTrace || !this.currentTraceStep) {
      return;
    }

    const previousStepPosition = this.currentTraceStep.tracePosition - 1;

    if (previousStepPosition < 1) {
      return;
    }

    const traceSteps = this.selectedTrace.hasMany('traceSteps').value();
    this.currentTraceStep = traceSteps?.objectAt(previousStepPosition - 1);

    this.args.highlightTrace(this.selectedTrace, previousStepPosition);

    const clazzCommunication = this.currentTraceStep?.belongsTo('clazzCommunication').value() as ClazzCommunication;

    if (this.isReplayAnimated && clazzCommunication) {
      this.args.moveCameraTo(clazzCommunication);
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
      this.args.moveCameraTo(clazz);
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
    this.args.removeComponent('trace-selection');
  }
}
