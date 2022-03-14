import { Package } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { getSubPackagesOfPackage, getClassesInPackage } from 'explorviz-frontend/utils/package-helpers';
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
  const packageCount = getSubPackagesOfPackage(component).length;

  return { classCount, packageCount };
}

function trimString(passedString: string, charLimit: number): string {
  if (passedString.length <= charLimit) {
    return passedString;
  }

  if (charLimit < 5) {
    return passedString.slice(1, charLimit);
  }

  const numberDots = 3;

  const dividerPrefix = Math.round((charLimit - numberDots) / 2);
  const dividerSuffix = Math.floor((charLimit - numberDots) / 2);

  const prefix = passedString.slice(0, dividerPrefix);
  const suffix = passedString.slice(-dividerSuffix);
  return `${prefix}...${suffix}`;
}

// #endregion HELPER

// #region LANDSCAPE CONTENT COMPOSER

function composeNodeContent(nodeMesh: NodeMesh) {
  const nodeModel = nodeMesh.dataModel;

  const content: DetailedInfo = {
    title: nodeMesh.getDisplayName(),
    entries: [],
  };

  content.entries.push({ key: '# Applications: ', value: trimString(`${nodeModel.applications.length}`, 40) });

  return content;
}

function composeApplicationContent(applicationMesh: ApplicationMesh) {
  const application = applicationMesh.dataModel;

  const content: DetailedInfo = { title: trimString(application.name, 40), entries: [] };

  content.entries.push({ key: 'Instance ID: ', value: trimString(application.id, 40) });
  content.entries.push({ key: 'Language: ', value: trimString(application.language, 40) });

  return content;
}

// #endregion LANDSCAPE CONTENT COMPOSER

// #region APPLICATION CONTENT COMPOSER

function composeComponentContent(componentMesh: ComponentMesh) {
  const component = componentMesh.dataModel;
  const { packageCount, classCount } = countComponentElements(component);

  const content: DetailedInfo = { title: trimString(component.name, 40), entries: [] };

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

  const content: DetailedInfo = { title: trimString(clazz.name, 40), entries: [] };

  content.entries.push({
    key: 'Instances:',
    value: '0',
  });

  content.entries.push({
    key: 'Inc. Requests:',
    value: '0',
  });

  content.entries.push({
    key: 'Out. Requests:',
    value: '0',
  });

  content.entries.push({
    key: 'Overall Requests:',
    value: '0',
  });

  return content;
}

function composeDrawableClazzCommunicationContent(
  communicationMesh: ClazzCommunicationMesh,
) {
  const communication = communicationMesh.dataModel;

  const commDirection = communication.bidirectional ? ' <-> ' : ' -> ';
  // const title = communication.sourceClass.name
  //  + commDirection
  //  + communication.targetClass.name;
  const title = `Source ${commDirection} Target`;

  const content: DetailedInfo = { title, entries: [] };

  content.entries.push({
    key: 'Requests: ',
    // value: communication.totalRequests.toString(),
    value: 'test',
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
