import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import Application from 'explorviz-frontend/models/application';
import THREE from 'three';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import Clazz from 'explorviz-frontend/models/clazz';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import Component from 'explorviz-frontend/models/component';
import Configuration from 'explorviz-frontend/services/configuration';
import { BoxLayout } from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import CalcCenterAndZoom from 'explorviz-frontend/utils/application-rendering/center-and-zoom-calculator';


export default class EntityRendering {
  // References to mesh maps of rendering
  modelIdToMesh: Map<string, BaseMesh>;

  commIdToMesh: Map<string, ClazzCommunicationMesh>;

  // Functions as parent object for all application objects
  applicationObject3D: THREE.Object3D;

  // Service to access color preferences
  configuration: Configuration;

  constructor(modelIdToMesh: Map<string, BaseMesh>, commIdToMesh: Map<string,
  ClazzCommunicationMesh>, applicationObject3D: THREE.Object3D, configuration: Configuration) {
    this.modelIdToMesh = modelIdToMesh;
    this.commIdToMesh = commIdToMesh;
    this.applicationObject3D = applicationObject3D;
    this.configuration = configuration;
  }

  addFoundationAndChildrenToScene(application: Application, boxLayoutMap: Map<string, BoxLayout>) {
    const foundationData = boxLayoutMap.get(application.id);

    if (foundationData === undefined) { return; }

    const OPENED_COMPONENT_HEIGHT = 1.5;

    // Access color preferences
    const {
      foundation: foundationColor,
      componentOdd: componentOddColor,
      highlightedEntity: highlightedEntityColor,
    } = this.configuration.applicationColors;

    const layoutPos = new THREE.Vector3(
      foundationData.positionX,
      foundationData.positionY,
      foundationData.positionZ,
    );

    const mesh = new FoundationMesh(layoutPos, OPENED_COMPONENT_HEIGHT, foundationData.width,
      foundationData.depth, application, new THREE.Color(foundationColor),
      new THREE.Color(highlightedEntityColor));

    const applicationCenter = CalcCenterAndZoom(foundationData);

    this.addMeshToScene(mesh, applicationCenter);

    const children = application.get('components');

    children.forEach((child: Component) => {
      this.addComponentAndChildrenToScene(child, componentOddColor, boxLayoutMap, application);
    });
  }

  addComponentAndChildrenToScene(component: Component, color: string,
    boxLayoutMap: Map<string, BoxLayout>, application: Application) {
    const componentData = boxLayoutMap.get(component.id);

    if (componentData === undefined) { return; }

    const {
      componentOdd: componentOddColor, componentEven: componentEvenColor,
      clazz: clazzColor, highlightedEntity: highlightedEntityColor,
    } = this.configuration.applicationColors;

    let layoutPos = new THREE.Vector3(componentData.positionX, componentData.positionY,
      componentData.positionZ);

    const mesh = new ComponentMesh(layoutPos, componentData.height, componentData.width,
      componentData.depth, component, new THREE.Color(color),
      new THREE.Color(highlightedEntityColor));

    const foundationData = boxLayoutMap.get(application.id);
    const applicationCenter = CalcCenterAndZoom(foundationData);

    this.addMeshToScene(mesh, applicationCenter);
    this.updateMeshVisiblity(mesh);

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz: Clazz) => {
      const clazzData = boxLayoutMap.get(clazz.get('id'));

      if (clazzData === undefined) { return; }

      layoutPos = new THREE.Vector3(clazzData.positionX, clazzData.positionY, clazzData.positionZ);
      const clazzMesh = new ClazzMesh(layoutPos, clazzData.height, clazzData.width, clazzData.depth,
        clazz, new THREE.Color(clazzColor), new THREE.Color(highlightedEntityColor));
      this.addMeshToScene(clazzMesh, applicationCenter);
      this.updateMeshVisiblity(clazzMesh);
    });

    children.forEach((child: Component) => {
      if (color === componentEvenColor) {
        this.addComponentAndChildrenToScene(child, componentOddColor, boxLayoutMap, application);
      } else {
        this.addComponentAndChildrenToScene(child, componentEvenColor, boxLayoutMap, application);
      }
    });
  } // END addComponentToScene

  addMeshToScene(mesh: ComponentMesh | ClazzMesh | FoundationMesh,
    applicationCenter: THREE.Vector3) {
    const layoutPosition = mesh.layoutPos;

    const centerPoint = new THREE.Vector3(
      layoutPosition.x + mesh.layoutWidth / 2.0,
      layoutPosition.y + mesh.layoutHeight / 2.0,
      layoutPosition.z + mesh.layoutdDepth / 2.0,
    );

    centerPoint.sub(applicationCenter);

    mesh.position.copy(centerPoint);

    this.applicationObject3D.add(mesh);
    this.modelIdToMesh.set(mesh.dataModel.id, mesh);
  }

  updateMeshVisiblity(mesh: ComponentMesh | ClazzMesh) {
    let parent: Component;
    if (mesh instanceof ComponentMesh) {
      parent = mesh.dataModel.parentComponent;
    } else {
      parent = mesh.dataModel.parent;
    }
    const parentMesh = this.modelIdToMesh.get(parent.get('id'));
    if (parentMesh instanceof ComponentMesh) {
      mesh.visible = parentMesh.opened;
    }
  }

  removeAllEntities() {
    this.modelIdToMesh.forEach((mesh) => {
      if (mesh instanceof BaseMesh) {
        mesh.delete();
      }
    });
    this.modelIdToMesh.clear();
  }
}
