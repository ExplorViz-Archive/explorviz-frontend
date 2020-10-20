import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { DynamicLandscapeData, Span, Trace } from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import { Class, StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { createHashCodeToClassMap, getApplicationFromClass, spanIdToClass } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import { createTraceIdToSpanTrees } from 'explorviz-frontend/utils/landscape-rendering/application-communication-computer';

interface Args {
  selectedTrace: Trace;
  structureData: StructureLandscapeData;
  dynamicData: DynamicLandscapeData;
  highlightTrace(trace: Trace, traceStep: string): void;
  moveCameraTo(emberModel: Class|Span): void;
}

export default class TraceReplayerMain extends Component<Args> {
  @tracked
  isReplayAnimated: boolean = true;

  @tracked
  currentTraceStep: Span|null = null;

  @tracked
  traceSteps: Span[] = [];

  constructor(owner: any, args: Args) {
    super(owner, args);
    const { selectedTrace, dynamicData } = this.args;
    this.traceSteps = TraceReplayerMain.calculateSortedTraceSteps(selectedTrace, dynamicData);

    if (this.traceSteps.length > 0) {
      const [firstStep] = this.traceSteps;
      this.currentTraceStep = firstStep;

      this.args.highlightTrace(this.args.selectedTrace, firstStep.spanId);

      if (this.isReplayAnimated) {
        this.args.moveCameraTo(this.currentTraceStep);
      }
    }
  }

  get currentTraceStepIndex() {
    return this.traceSteps.findIndex((span) => span === this.currentTraceStep);
  }

  get sourceClass() {
    const { currentTraceStep, args: { selectedTrace } } = this;
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
    const { currentTraceStep, args: { selectedTrace } } = this;
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

  static calculateSortedTraceSteps(trace: Trace, dynamicData: DynamicLandscapeData) {
    function getSortedSpanList(span: Span, tree: Map<string, Span[]>): Span[] {
      const childSpans = tree.get(span.spanId);

      if (childSpans === undefined || childSpans.length === 0) {
        return [span];
      }

      const subSpans = childSpans.map((subSpan) => getSortedSpanList(subSpan, tree)).flat();

      return [span, ...subSpans];
    }

    const spanTree = createTraceIdToSpanTrees(dynamicData)
      .get(trace.traceId);

    if (spanTree === undefined) {
      return [];
    }

    const { root, tree } = spanTree;

    return getSortedSpanList(root, tree);
  }

  @action
  toggleAnimation() {
    this.isReplayAnimated = !this.isReplayAnimated;
  }

  @action
  selectNextTraceStep() {
    // Can only select next step if a trace is selected
    if (!this.currentTraceStep) {
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

    this.args.highlightTrace(this.args.selectedTrace, this.currentTraceStep.spanId);

    if (this.isReplayAnimated) {
      this.args.moveCameraTo(this.currentTraceStep);
    }
  }

  @action
  selectPreviousTraceStep() {
    // Can only select next step if a trace is selected
    if (!this.currentTraceStep) {
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

    this.args.highlightTrace(this.args.selectedTrace, this.currentTraceStep.spanId);

    if (this.isReplayAnimated) {
      this.args.moveCameraTo(this.currentTraceStep);
    }
  }
}
