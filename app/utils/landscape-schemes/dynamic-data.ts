export interface Trace {
  landscapeToken: string;
  traceId: string;
  startTime: {
    seconds: number,
    nanoAdjust: number,
  };
  endTime: {
    seconds: number,
    nanoAdjust: number,
  };
  duration: number;
  overallRequestCount: 1;
  traceCount: number;
  spanList: Span[];
  tree: [Span, Map<string, Span[]>]
}

export interface Span {
  landscapeToken: string;
  spanId: string;
  parentSpanId: string;
  traceId: string;
  startTime: {
    seconds: number,
    nanoAdjust: number,
  };
  endTime: {
    seconds: number,
    nanoAdjust: number,
  };
  hashCode: string;
}

export type DynamicLandscapeData = Trace[];
