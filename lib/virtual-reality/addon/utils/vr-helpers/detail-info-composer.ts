import { isApplication, isNode, Package } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { getAncestorPackages, getClassesInPackage } from 'explorviz-frontend/utils/package-helpers';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import THREE from 'three';
import {
  APPLICATION_ENTITY_TYPE,
  CLASS_COMMUNICATION_ENTITY_TYPE,
  CLASS_ENTITY_TYPE,
  COMPONENT_ENTITY_TYPE,
  EntityType,
  NODE_ENTITY_TYPE,
} from '../vr-message/util/entity_type';

export type DetailedInfo = {
  title: string;
  entries: { key: string; value: string }[];
};

// #region HELPER

function countComponentElements(component: Package) {
  const classCount = getClassesInPackage(component).length;
  const packageCount = getAncestorPackages(component).length;

  return { classCount, packageCount };
}

// #endregion HELPER

// #region LANDSCAPE CONTENT COMPOSER

function composeNodeContent(nodeMesh: NodeMesh) {
  const content: DetailedInfo = {
    title: nodeMesh.getDisplayName(),
    entries: [],
  };

  return content;
}

function composeApplicationContent(applicationMesh: ApplicationMesh) {
  const application = applicationMesh.dataModel;

  const content: DetailedInfo = { title: application.name, entries: [] };

  content.entries.push({ key: 'Instance ID: ', value: application.instanceId });
  content.entries.push({ key: 'Language: ', value: application.language });

  return content;
}

// #endregion LANDSCAPE CONTENT COMPOSER

// #region APPLICATION CONTENT COMPOSER

function composeComponentContent(componentMesh: ComponentMesh) {
  const component = componentMesh.dataModel;
  const { packageCount, classCount } = countComponentElements(component);

  const content: DetailedInfo = { title: component.name, entries: [] };

  content.entries.push({
    key: 'Contained Packages: ',
    value: packageCount.toString(),
  });
  content.entries.push({
    key: 'Contained Classes: ',
    value: classCount.toString(),
  });

  return content;
}

function composeClazzContent(clazzMesh: ClazzMesh) {
  const clazz = clazzMesh.dataModel;

  const content: DetailedInfo = { title: clazz.name, entries: [] };

  return content;
}

function composeDrawableClazzCommunicationContent(
  communicationMesh: ClazzCommunicationMesh,
) {
  const communication = communicationMesh.dataModel;

  const commDirection = communication.bidirectional ? ' <-> ' : ' -> ';
  const title = communication.sourceClass.name
    + commDirection
    + communication.targetClass.name;

  const content: DetailedInfo = { title, entries: [] };

  content.entries.push({
    key: 'Requests: ',
    value: communication.totalRequests.toString(),
  });

  return content;
}

// #endregion APPLICATION CONTENT COMPOSER

export default function composeContent(object: THREE.Object3D) {
  let content: DetailedInfo | null = null;

  // Landscape Content
  if (object instanceof NodeMesh) {
    content = composeNodeContent(object);
  } else if (object instanceof ApplicationMesh) {
    content = composeApplicationContent(object);
    // Application Content
  } else if (object instanceof ComponentMesh) {
    content = composeComponentContent(object);
  } else if (object instanceof ClazzMesh) {
    content = composeClazzContent(object);
  } else if (object instanceof ClazzCommunicationMesh) {
    content = composeDrawableClazzCommunicationContent(object);
  }

  return content;
}

export type EntityMesh =
  | NodeMesh
  | ApplicationMesh
  | ComponentMesh
  | ClazzMesh
  | ClazzCommunicationMesh;

export function isEntityMesh(object: any): object is EntityMesh {
  return (
    object instanceof NodeMesh
    || object instanceof ApplicationMesh
    || object instanceof ComponentMesh
    || object instanceof ClazzMesh
    || object instanceof ClazzCommunicationMesh
  );
}

export function getIdOfEntity(entity: EntityMesh): string {
  const model = entity.dataModel;
  if (isNode(model)) {
    return model.ipAddress;
  }
  if (isApplication(model)) {
    return model.id;
  }
  return model.id;
}

export function getTypeOfEntity(entity: EntityMesh): EntityType {
  if (entity instanceof NodeMesh) {
    return NODE_ENTITY_TYPE;
  }
  if (entity instanceof ApplicationMesh) {
    return APPLICATION_ENTITY_TYPE;
  }
  if (entity instanceof ComponentMesh) {
    return COMPONENT_ENTITY_TYPE;
  }
  if (entity instanceof ClazzMesh) {
    return CLASS_ENTITY_TYPE;
  }
  return CLASS_COMMUNICATION_ENTITY_TYPE;
}
