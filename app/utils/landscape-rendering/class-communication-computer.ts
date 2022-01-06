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

  const aggregatedMethodCalls = new Map<string, AggregatedClassCommunication>();

  totalClassCommunications.forEach(({ sourceClass, targetClass, operationName }) => {
    const sourceTargetClassMethodId = `${sourceClass.id}_${targetClass.id}_${operationName}`;

    // get source app
    const sourceApp = getApplicationFromClass(landscapeStructureData, sourceClass);

    // get target app
    const targetApp = getApplicationFromClass(landscapeStructureData, targetClass);

    // Find all identical method calls based on their source
    // and target app / class
    // and aggregate identical method calls with exactly same source
    // and target app / class within a single representative
    const aggregatedClassCommunication = aggregatedMethodCalls.get(sourceTargetClassMethodId);

    if (!aggregatedClassCommunication) {
      aggregatedMethodCalls.set(sourceTargetClassMethodId, {
        totalRequests: 1,
        sourceClass,
        targetClass,
        operationName,
        sourceApp,
        targetApp,
      });
    } else {
      aggregatedClassCommunication.totalRequests++;
    }
  });

  // Find bidirectional and self-directed method calls
  const sourceTargetClassMethodIdToDrawable = new Map<string, DrawableClassCommunication>();

  aggregatedMethodCalls.forEach(({
    sourceClass, targetClass, totalRequests, operationName, sourceApp, targetApp,
  }) => {
    const targetSourceClassMethodId = `${targetClass.id}_${sourceClass.id}_${operationName}`;

    if (sourceClass === targetClass) {
      sourceTargetClassMethodIdToDrawable.set(targetSourceClassMethodId, {
        id: targetSourceClassMethodId,
        totalRequests,
        sourceClass,
        targetClass,
        bidirectional: true,
        operationName,
        sourceApp,
        targetApp,
      });
    } else {
      const drawableClassCommunication = sourceTargetClassMethodIdToDrawable
        .get(targetSourceClassMethodId);

      if (drawableClassCommunication) {
        // if true, this indicates that we have found a "reversed" method
        // call for a previously processed method call.
        // This is a bidirectional communication line.
        drawableClassCommunication.bidirectional = true;
        // drawableClassCommunication.totalRequests += totalRequests;
        // TODO the line above cannot be true right? The comm line is
        // bidirectional, but the underlying method calls are different,
        // therefore should be counted seperately?
      } else {
        const sourceAndTargetClassId = `${sourceClass.id}_${targetClass.id}_${operationName}`;
        sourceTargetClassMethodIdToDrawable.set(sourceAndTargetClassId, {
          id: sourceAndTargetClassId,
          totalRequests,
          sourceClass,
          targetClass,
          bidirectional: false,
          operationName,
          sourceApp,
          targetApp,
        });
      }
    }
  });

  const drawableClassCommunications = [...sourceTargetClassMethodIdToDrawable.values()];

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
  sourceApp: Application | undefined;
  targetApp: Application | undefined;
}

export interface DrawableClassCommunication {
  id: string;
  totalRequests: number;
  sourceClass: Class;
  targetClass: Class;
  bidirectional: boolean;
  operationName: string;
  sourceApp: Application | undefined;
  targetApp: Application | undefined;
}
