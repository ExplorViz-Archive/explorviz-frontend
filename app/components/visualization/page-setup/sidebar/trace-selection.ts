import { action, computed } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { createHashCodeToClassMap } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import {
  DynamicLandscapeData, Span, Trace,
} from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import { Class, Application } from 'explorviz-frontend/utils/landscape-schemes/structure-data';

export type TimeUnit = 'ns' | 'ms' | 's';

interface Args {
  moveCameraTo(emberModel: Class|Span): void;
  selectTrace(trace: Trace): void;
  readonly dynamicData: DynamicLandscapeData;
  readonly application: Application;
  readonly selectedTrace: Trace;
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

  // Compute current traces when highlighting changes
  @computed('args.selectedTrace', 'sortBy', 'isSortedAsc', 'filterTerm')
  get traces() {
    if (this.args.selectedTrace) {
      return [this.args.selectedTrace];
    }

    return this.filterAndSortTraces(this.args.dynamicData);
  }

  get traceDurations() {
    return this.traces.map((trace) => TraceSelection.calculateTraceDuration(trace));
  }

  static calculateTraceDuration(trace: Trace) {
    const { startTime, endTime } = trace;

    const startTimeInNs = startTime.seconds * 1000000000.0 + startTime.nanoAdjust;
    const endTimeInNs = endTime.seconds * 1000000000.0 + endTime.nanoAdjust;

    return endTimeInNs - startTimeInNs;
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
  filter() {
    // Case insensitive string filter
    this.filterTerm = this.filterInput.toLowerCase();
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
}
