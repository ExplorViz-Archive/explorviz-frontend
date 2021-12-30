import { DynamicLandscapeData, Span } from '../landscape-schemes/dynamic-data';
import {
  Application,
  Class, StructureLandscapeData,
} from '../landscape-schemes/structure-data';
import { getHashCodeToClassMap, getApplicationFromClass } from '../landscape-structure-helpers';
import isObject from '../object-helpers';
import { getTraceIdToSpanTreeMap } from '../trace-helpers';

function computeClassCommunicationRecursively(span: Span, spanIdToChildSpanMap: Map<string, Span[]>,
  hashCodeToClassMap: Map<string, Class>) {
  const childSpans = spanIdToChildSpanMap.get(span.spanId);

  if (childSpans === undefined) {
    return [];
  }

  const classMatchingSpan = hashCodeToClassMap.get(span.hashCode);

  if (classMatchingSpan === undefined) {
    return [];
  }

  const classCommunications: ClassCommunication[] = [];
  childSpans.forEach((childSpan) => {
    const classMatchingChildSpan = hashCodeToClassMap.get(childSpan.hashCode);
    if (classMatchingChildSpan !== undefined) {
      // retrieve operationName
      const methodMatchingSpanHash = classMatchingChildSpan
        .methods.find((method) => method.hashCode === childSpan.hashCode);

      const methodName = methodMatchingSpanHash ? methodMatchingSpanHash.name : 'UNKNOWN';

      classCommunications.push({
        sourceClass: classMatchingSpan,
        targetClass: classMatchingChildSpan,
        operationName: methodName,
      });
      classCommunications.push(...computeClassCommunicationRecursively(childSpan,
        spanIdToChildSpanMap, hashCodeToClassMap));
    }
  });

  return classCommunications;
}

export default function computeDrawableClassCommunication(
  landscapeStructureData: StructureLandscapeData,
  landscapeDynamicData: DynamicLandscapeData,
) {
  if (landscapeDynamicData.length === 0) {
    return [];
  }
  const hashCodeToClassMap = getHashCodeToClassMap(landscapeStructureData);

  const traceIdToSpanTrees = getTraceIdToSpanTreeMap(landscapeDynamicData);

  const totalClassCommunications: ClassCommunication[] = [];

  landscapeDynamicData.forEach((trace) => {
    const traceSpanTree = traceIdToSpanTrees.get(trace.traceId);

    if (traceSpanTree) {
      const firstSpan = traceSpanTree.root;
      totalClassCommunications.push(...computeClassCommunicationRecursively(firstSpan,
        traceSpanTree.tree, hashCodeToClassMap));
    }
  });

  const classIdsToAggregated = new Map<string, AggregatedClassCommunication>();

  totalClassCommunications.forEach(({ sourceClass, targetClass, operationName }) => {
    const sourceAndTargetClassId = `${sourceClass.id}_${targetClass.id}`;

    // get source app
    const sourceApp = getApplicationFromClass(landscapeStructureData, sourceClass);

    // get target app
    const targetApp = getApplicationFromClass(landscapeStructureData, targetClass);

    const aggregatedClassCommunication = classIdsToAggregated.get(sourceAndTargetClassId);

    if (!aggregatedClassCommunication) {
      classIdsToAggregated.set(sourceAndTargetClassId, {
        totalRequests: 1,
        sourceClass,
        targetClass,
        operationName,
        sourceApplications: [sourceApp],
      });
    } else {
      aggregatedClassCommunication.totalRequests++;

      const { sourceApplications } = aggregatedClassCommunication;

      if (!sourceApplications.includes(sourceApp)) {
        aggregatedClassCommunication.sourceApplications.push(sourceApp);
      }
    }
  });

  const sourceTargetClassIdToDrawable = new Map<string, DrawableClassCommunication>();

  classIdsToAggregated.forEach(({
    sourceClass, targetClass, totalRequests, operationName, sourceApplications,
  }) => {
    const targetSourceClassId = `${targetClass.id}_${sourceClass.id}`;

    if (sourceClass === targetClass) {
      sourceTargetClassIdToDrawable.set(targetSourceClassId, {
        id: targetSourceClassId,
        totalRequests,
        sourceClass,
        targetClass,
        bidirectional: true,
        operationName,
        sourceApplications,
      });
    } else {
      const drawableClassCommunication = sourceTargetClassIdToDrawable.get(targetSourceClassId);

      if (drawableClassCommunication) {
        drawableClassCommunication.bidirectional = true;
        drawableClassCommunication.totalRequests += totalRequests;
      } else {
        const sourceAndTargetClassId = `${sourceClass.id}_${targetClass.id}`;
        sourceTargetClassIdToDrawable.set(sourceAndTargetClassId, {
          id: sourceAndTargetClassId,
          totalRequests,
          sourceClass,
          targetClass,
          bidirectional: false,
          operationName,
          sourceApplications,
        });
      }
    }
  });

  const drawableClassCommunications = [...sourceTargetClassIdToDrawable.values()];

  return drawableClassCommunications;
}

export function isDrawableClassCommunication(x: any): x is DrawableClassCommunication {
  return isObject(x) && Object.prototype.hasOwnProperty.call(x, 'bidirectional');
}

interface ClassCommunication {
  sourceClass: Class;
  targetClass: Class;
  operationName: string;
}

interface AggregatedClassCommunication {
  totalRequests: number;
  sourceClass: Class;
  targetClass: Class;
  operationName: string;
  sourceApplications: (Application | undefined)[];
}

export interface DrawableClassCommunication {
  id: string;
  totalRequests: number;
  sourceClass: Class;
  targetClass: Class;
  bidirectional: boolean;
  operationName: string;
  sourceApplications: (Application | undefined)[];
}
