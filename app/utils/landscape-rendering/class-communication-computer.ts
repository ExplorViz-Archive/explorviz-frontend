import { DynamicLandscapeData, Span } from '../landscape-schemes/dynamic-data';
import {
  Application, Class, Package, StructureLandscapeData,
} from '../landscape-schemes/structure-data';
import { createTraceIdToSpanTrees } from './application-communication-computer';

function getAllClassesFromPackageRecursively(component: Package) {
  const classes = [];
  classes.push(...component.classes);
  component.subPackages.forEach((subComponent) => {
    classes.push(...getAllClassesFromPackageRecursively(subComponent));
  });

  return classes;
}

function getAllClassesFromApplication(application: Application) {
  return application.packages.map((component) => getAllClassesFromPackageRecursively(component))
    .flat();
}

function createHashCodeToClassMap(landscapeStructureData: StructureLandscapeData) {
  const hashCodeToClassMap = new Map<string, Class>();

  const classesInLandscape = landscapeStructureData.nodes.map((node) => node.applications.map(
    (application) => getAllClassesFromApplication(application),
  )).flat(2);

  classesInLandscape.forEach((clazz) => {
    clazz.methods.forEach(({ hashCode }) => hashCodeToClassMap.set(hashCode, clazz));
  });

  return hashCodeToClassMap;
}

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
      classCommunications.push({
        sourceClass: classMatchingSpan,
        targetClass: classMatchingChildSpan,
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
  const hashCodeToClassMap = createHashCodeToClassMap(landscapeStructureData);

  const traceIdToSpanTrees = createTraceIdToSpanTrees(landscapeDynamicData);

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

  totalClassCommunications.forEach(({ sourceClass, targetClass }) => {
    const sourceAndTargetClassId = `${sourceClass.id}_${targetClass.id}`;

    const aggregatedClassCommunication = classIdsToAggregated.get(sourceAndTargetClassId);

    if (!aggregatedClassCommunication) {
      classIdsToAggregated.set(sourceAndTargetClassId, {
        totalRequests: 1,
        sourceClass,
        targetClass,
      });
    } else {
      aggregatedClassCommunication.totalRequests++;
    }
  });

  const sourceTargetClassIdToDrawable = new Map<string, DrawableClassCommunication>();

  classIdsToAggregated.forEach(({ sourceClass, targetClass, totalRequests }) => {
    const targetSourceClassId = `${targetClass.id}_${sourceClass.id}`;

    if (sourceClass === targetClass) {
      sourceTargetClassIdToDrawable.set(targetSourceClassId, {
        id: targetSourceClassId,
        totalRequests,
        sourceClass,
        targetClass,
        bidirectional: true,
      });
    } else {
      const drawableClassCommunication = sourceTargetClassIdToDrawable.get(targetSourceClassId);

      if (drawableClassCommunication !== undefined) {
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
        });
      }
    }
  });

  const drawableClassCommunications = [...sourceTargetClassIdToDrawable.values()];

  return drawableClassCommunications;
}

interface ClassCommunication {
  sourceClass: Class;
  targetClass: Class;
}

interface AggregatedClassCommunication {
  totalRequests: number;
  sourceClass: Class;
  targetClass: Class;
}

export interface DrawableClassCommunication {
  id: string;
  totalRequests: number;
  sourceClass: Class;
  targetClass: Class;
  bidirectional: boolean;
}
