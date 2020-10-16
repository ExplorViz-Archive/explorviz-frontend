import { DynamicLandscapeData, Span } from '../landscape-schemes/dynamic-data';
import { Application, Package, StructureLandscapeData } from '../landscape-schemes/structure-data';

function getHashCodesFromPackage(component: Package): string[] {
  const hashCodes: string[] = [];

  component.classes.forEach((clazz) => {
    clazz.methods.forEach((method) => {
      hashCodes.push(method.hashCode);
    });
  });

  component.subPackages.forEach((subComponent) => {
    hashCodes.push(...getHashCodesFromPackage(subComponent));
  });

  return hashCodes;
}

function getAllHashCodesForApplication(application: Application) {
  const { packages } = application;

  const applicationHashCodes: string[] = [];

  packages.forEach((component) => {
    applicationHashCodes.push(...getHashCodesFromPackage(component));
  });

  return applicationHashCodes;
}

function computeApplicationCommunicationRecursively(span: Span,
  parentSpanIdToChildSpanMap: Map<string, Span[]>,
  hashCodeToApplicationMap: Map<string, Application>) {
  const childSpans = parentSpanIdToChildSpanMap.get(span.spanId);

  if (childSpans === undefined) {
    return [];
  }

  const parentSpanApplication = hashCodeToApplicationMap.get(span.hashCode)!;

  const allApplicationCommunications: ApplicationCommunication[] = [];

  childSpans.forEach((childSpan) => {
    const childSpanApplication = hashCodeToApplicationMap.get(childSpan.hashCode)!;

    if (parentSpanApplication !== childSpanApplication) {
      const applicationCommunication: ApplicationCommunication = {
        id: `${parentSpanApplication.pid}_${childSpanApplication.pid}`,
        sourceApplication: parentSpanApplication,
        targetApplication: childSpanApplication,
      };
      allApplicationCommunications.push(applicationCommunication);
    }
    const childCommunications = computeApplicationCommunicationRecursively(childSpan,
      parentSpanIdToChildSpanMap, hashCodeToApplicationMap);

    allApplicationCommunications.push(...childCommunications);
  });

  return allApplicationCommunications;
}

function sortSpanArrayByTime(spanArary: Span[]) {
  spanArary.sort((span1, span2) => {
    if (span1.startTime.seconds < span2.startTime.seconds
      || (span1.startTime.seconds === span2.startTime.seconds
        && span1.startTime.nanoAdjust < span2.startTime.nanoAdjust)) {
      return -1;
    }
    if (span1.startTime.seconds === span2.startTime.seconds
      && span1.startTime.nanoAdjust === span2.startTime.nanoAdjust) {
      return 0;
    }
    return -1;
  });
}

export function createTraceIdToSpanTrees(landscapeDynamicData: DynamicLandscapeData) {
  const traceIdToSpanTree = new Map<string, SpanTree>();

  landscapeDynamicData.forEach((trace) => {
    let firstSpan: Span = trace.spanList[0];

    // Put spans into map for more efficient lookup when sorting
    const spanIdToSpanMap = new Map<string, Span>();
    trace.spanList.forEach((span) => {
      if (span.parentSpanId === '') {
        firstSpan = span;
      } else {
        spanIdToSpanMap.set(span.spanId, span);
      }
    });

    const parentSpanIdToChildSpansMap = new Map<string, Span[]>();

    trace.spanList.forEach((span) => {
      parentSpanIdToChildSpansMap.set(span.spanId, []);
    });

    trace.spanList.forEach((span) => {
      parentSpanIdToChildSpansMap.get(span.parentSpanId)?.push(span);
    });

    parentSpanIdToChildSpansMap.forEach((spanArary) => sortSpanArrayByTime(spanArary));

    const tree: SpanTree = {
      root: firstSpan,
      tree: parentSpanIdToChildSpansMap,
    };

    traceIdToSpanTree.set(trace.traceId, tree);
  });

  return traceIdToSpanTree;
}

function createHashCodeToApplicationMap(landscapeStructure: StructureLandscapeData) {
  const hashCodeToApplicationMap = new Map<string, Application>();

  landscapeStructure.nodes.forEach((node) => {
    node.applications.forEach((application) => {
      getAllHashCodesForApplication(application).forEach((hashCode) => {
        hashCodeToApplicationMap.set(hashCode, application);
      });
    });
  });

  return hashCodeToApplicationMap;
}

export default function computeApplicationCommunication(landscape: StructureLandscapeData,
  landscapeDynamicData: DynamicLandscapeData) {
  if (landscapeDynamicData.length === 0) {
    return [];
  }
  const hashCodeToApplicationMap = createHashCodeToApplicationMap(landscape);

  const traceIdToSpanTrees = createTraceIdToSpanTrees(landscapeDynamicData);

  const applicationCommunications: ApplicationCommunication[] = [];

  landscapeDynamicData.forEach((trace) => {
    const spanTree = traceIdToSpanTrees.get(trace.traceId);
    if (spanTree !== undefined) {
      applicationCommunications.push(...computeApplicationCommunicationRecursively(spanTree.root,
        spanTree.tree, hashCodeToApplicationMap));
    }
  });

  // filter out duplicates
  const comms = applicationCommunications
    .filter((v, i, a) => a.findIndex((t) => (t.id === v.id)) === i);

  return comms;
}

interface SpanTree {
  root: Span,
  tree: Map<string, Span[]>
}

export interface ApplicationCommunication {
  id: string;
  sourceApplication: Application;
  targetApplication: Application;
}
