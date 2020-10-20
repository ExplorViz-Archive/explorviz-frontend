import { action, computed } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import { createTraceIdToSpanTrees } from 'explorviz-frontend/utils/landscape-rendering/application-communication-computer';
import { createHashCodeToClassMap, getApplicationFromClass, spanIdToClass } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import {
  DynamicLandscapeData, Span, Trace,
} from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import { Class, Application, StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';

export type TimeUnit = 'ns' | 'ms' | 's';

interface Args {
  removeComponent(componentPath: string): void;
  highlightTrace(trace: Trace, traceStep: string): void;
  moveCameraTo(emberModel: Class|Span): void;
  highlighter: Highlighting;
  dynamicData: DynamicLandscapeData;
  structureData: StructureLandscapeData;
  application: Application;
}

export default class TraceSelection extends Component<Args> {
  // default time units
  @tracked
  traceTimeUnit: TimeUnit = 'ms';

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
  currentTraceStep: Span|null = null;

  @tracked
  traceSteps: Span[] = [];

  // Compute current traces when highlighting changes
  @computed('args.dynamicData', 'selectedTrace', 'sortBy', 'isSortedAsc', 'filterTerm')
  get traces() {
    if (this.selectedTrace) {
      return [this.selectedTrace];
    }

    return this.filterAndSortTraces(this.args.dynamicData);
  }

  get currentTraceStepIndex() {
    return this.traceSteps.findIndex((span) => span === this.currentTraceStep);
  }

  get sourceClass() {
    const { currentTraceStep, selectedTrace } = this;
    if (selectedTrace && currentTraceStep) {
      return spanIdToClass(this.args.structureData, selectedTrace, currentTraceStep.parentSpanId);
    }
    return undefined;
  }

  get sourceApplication() {
    return this.sourceClass
      ? getApplicationFromClass(this.args.structureData, this.sourceClass) : undefined;
  }

  get targetClass() {
    const { currentTraceStep, selectedTrace } = this;
    if (selectedTrace && currentTraceStep) {
      return spanIdToClass(this.args.structureData, selectedTrace, currentTraceStep.spanId);
    }
    return undefined;
  }

  get targetApplication() {
    return this.targetClass
      ? getApplicationFromClass(this.args.structureData, this.targetClass) : undefined;
  }

  get operationName() {
    const hashCodeToClassMap = createHashCodeToClassMap(this.args.structureData);

    if (this.currentTraceStep) {
      const clazz = hashCodeToClassMap.get(this.currentTraceStep.hashCode);

      return clazz?.methods
        .find((method) => method.hashCode === this.currentTraceStep?.hashCode)?.name;
    }
    return undefined;
  }

  get spanDuration() {
    if (this.currentTraceStep) {
      const { startTime, endTime } = this.currentTraceStep;

      const startTimeInNs = startTime.seconds * 1000000000.0 + startTime.nanoAdjust;
      const endTimeInNs = endTime.seconds * 1000000000.0 + endTime.nanoAdjust;

      return endTimeInNs - startTimeInNs;
    }

    return undefined;
  }

  get traceDuration() {
    if (this.selectedTrace) {
      const { startTime, endTime } = this.selectedTrace;

      const startTimeInNs = startTime.seconds * 1000000000.0 + startTime.nanoAdjust;
      const endTimeInNs = endTime.seconds * 1000000000.0 + endTime.nanoAdjust;

      return endTimeInNs - startTimeInNs;
    }

    return undefined;
  }

  filterAndSortTraces(traces: Trace[]) {
    const hashCodeToClassMap = createHashCodeToClassMap(this.args.application);

    const tracesInThisApplication = traces.filter(
      (trace) => trace.spanList.any((span) => hashCodeToClassMap.get(span.hashCode) !== undefined),
    );
    /*     if (!traces) {
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

    return filteredTraces; */

    return tracesInThisApplication;
  }

  @action
  clickedTrace(trace: Trace) {
    // Reset highlighting when highlighted trace is clicked again
    if (trace === this.selectedTrace) {
      this.selectedTrace = null;
      this.args.highlighter.removeHighlighting();
      return;
    }

    this.selectedTrace = trace;

    this.traceSteps = this.calculateTraceSteps();

    if (this.traceSteps.length > 0) {
      const [firstStep] = this.traceSteps;
      this.currentTraceStep = firstStep;

      this.args.highlightTrace(trace, firstStep.spanId);

      if (this.isReplayAnimated) {
        this.args.moveCameraTo(this.currentTraceStep);
      }
    }
  }

  calculateTraceSteps() {
    function getSortedTraceList(span: Span, tree: Map<string, Span[]>): Span[] {
      const childSpans = tree.get(span.spanId);

      if (childSpans === undefined || childSpans.length === 0) {
        return [span];
      }

      const subSpans = childSpans.map((subSpan) => getSortedTraceList(subSpan, tree)).flat();

      return [span, ...subSpans];
    }

    if (this.selectedTrace) {
      const spanTree = createTraceIdToSpanTrees(this.args.dynamicData)
        .get(this.selectedTrace.traceId);

      if (spanTree === undefined) {
        return [];
      }

      const { root, tree } = spanTree;

      return getSortedTraceList(root, tree);
    }

    return [];
  }

  @action
  filter() {
    // Case insensitive string filter
    this.filterTerm = this.filterInput.toLowerCase();
  }

  @action
  selectNextTraceStep() {
    // Can only select next step if a trace is selected
    if (!this.currentTraceStep || !this.selectedTrace) {
      return;
    }

    const currentTracePosition = this.traceSteps
      .findIndex((span) => span === this.currentTraceStep);

    if (currentTracePosition === -1) {
      return;
    }

    const nextStepPosition = currentTracePosition + 1;

    if (nextStepPosition > this.traceSteps.length - 1) {
      return;
    }

    this.currentTraceStep = this.traceSteps[nextStepPosition];

    this.args.highlightTrace(this.selectedTrace, this.currentTraceStep.spanId);

    if (this.isReplayAnimated) {
      this.args.moveCameraTo(this.currentTraceStep);
    }
  }

  @action
  selectPreviousTraceStep() {
    // Can only select next step if a trace is selected
    if (!this.selectedTrace || !this.currentTraceStep) {
      return;
    }

    const currentTracePosition = this.traceSteps
      .findIndex((span) => span === this.currentTraceStep);

    if (currentTracePosition === -1) {
      return;
    }

    const previousStepPosition = currentTracePosition - 1;

    if (previousStepPosition < 0) {
      return;
    }

    this.currentTraceStep = this.traceSteps[previousStepPosition];

    this.args.highlightTrace(this.selectedTrace, this.currentTraceStep.spanId);

    if (this.isReplayAnimated) {
      this.args.moveCameraTo(this.currentTraceStep);
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
  toggleAnimation(this: TraceSelection) {
    this.isReplayAnimated = !this.isReplayAnimated;
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

  willDestroy() {
    if (this.selectedTrace) {
      this.args.highlighter.removeHighlighting();
    }
  }
}
