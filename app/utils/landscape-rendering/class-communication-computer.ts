import { DynamicLandscapeData, Span, Trace } from '../landscape-schemes/dynamic-data';
import {
  Application, Class, isApplication, Package, StructureLandscapeData,
} from '../landscape-schemes/structure-data';
import { createTraceIdToSpanTrees } from './application-communication-computer';

function isObject(obj: any): obj is object {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function getAllClassesFromPackageRecursively(component: Package) {
  const classes = [];
  classes.push(...component.classes);
  component.subPackages.forEach((subComponent) => {
    classes.push(...getAllClassesFromPackageRecursively(subComponent));
  });

  return classes;
}

export function getAllClassesFromApplication(application: Application) {
  return application.packages.map((component) => getAllClassesFromPackageRecursively(component))
    .flat();
}

export function createHashCodeToClassMap(structureData: StructureLandscapeData|Application) {
  const hashCodeToClassMap = new Map<string, Class>();

  let classList: Class[];

  if (isApplication(structureData)) {
    classList = getAllClassesFromApplication(structureData);
  } else {
    classList = structureData.nodes.map((node) => node.applications.map(
      (application) => getAllClassesFromApplication(application),
    )).flat(2);
  }

  classList.forEach((clazz) => {
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

export function spanIdToClass(structureData: Application|StructureLandscapeData,
  trace: Trace, id: string) {
  const hashCodeToClassMap = createHashCodeToClassMap(structureData);

  const spanIdToClassMap = new Map<string, Class>();

  trace.spanList.forEach((span) => {
    const { hashCode, spanId } = span;

    const clazz = hashCodeToClassMap.get(hashCode);

    if (clazz !== undefined) {
      spanIdToClassMap.set(spanId, clazz);
    }
  });

  return spanIdToClassMap.get(id);
}

export function packageContainsClass(component: Package, clazz: Class): boolean {
  return component.classes.includes(clazz)
    || (component.subPackages.length > 0
      && component.subPackages.any(
        (subPackage) => packageContainsClass(subPackage, clazz),
      ));
}

export function applicationHasClass(application: Application, clazz: Class) {
  return application.packages.any((component) => packageContainsClass(component, clazz));
}

export function getApplicationFromClass(structureData: StructureLandscapeData, clazz: Class) {
  let matchingApplication: Application|undefined;

  structureData.nodes.forEach((node) => {
    const possibleMatch = node.applications
      .find((application) => applicationHasClass(application, clazz));

    if (possibleMatch) {
      matchingApplication = possibleMatch;
    }
  });

  return matchingApplication;
}

export function spanIdToClassAndApplication(structureData: StructureLandscapeData,
  trace: Trace, id: string) {
  const clazz = spanIdToClass(structureData, trace, id);

  if (clazz !== undefined) {
    const application = getApplicationFromClass(structureData, clazz);

    if (application !== undefined) {
      return {
        application,
        class: clazz,
      };
    }
  }

  return undefined;
}

export function isDrawableClassCommunication(x: any): x is DrawableClassCommunication {
  return isObject(x) && Object.prototype.hasOwnProperty.call(x, 'bidirectional');
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
