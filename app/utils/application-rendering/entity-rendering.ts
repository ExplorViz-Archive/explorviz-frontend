import THREE from 'three';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import Configuration from 'explorviz-frontend/services/configuration';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import { Application, Package } from 'explorviz-frontend/services/landscape-listener';

export default class EntityRendering {
  // Functions as parent object for all application objects
  applicationObject3D: ApplicationObject3D;

  // Service to access color preferences
  configuration: Configuration;

  constructor(applicationObject3D: ApplicationObject3D, configuration: Configuration) {
    this.applicationObject3D = applicationObject3D;
    this.configuration = configuration;
  }

  addFoundationAndChildrenToScene(application: Application, boxLayoutMap: Map<string, BoxLayout>) {
    const applicationLayout = boxLayoutMap.get(application.pid);

    if (applicationLayout === undefined) { return; }

    const OPENED_COMPONENT_HEIGHT = 1.5;

    // Access color preferences
    const {
      foundation: foundationColor,
      componentOdd: componentOddColor,
      highlightedEntity: highlightedEntityColor,
    } = this.configuration.applicationColors;

    const layoutPos = new THREE.Vector3(
      applicationLayout.positionX,
      applicationLayout.positionY,
      applicationLayout.positionZ,
    );

    const mesh = new FoundationMesh(layoutPos, OPENED_COMPONENT_HEIGHT, applicationLayout.width,
      applicationLayout.depth, application, foundationColor,
      highlightedEntityColor);

    const applicationCenter = applicationLayout.center;

    this.addMeshToScene(mesh, applicationCenter);

    const children = application.packages;

    children.forEach((child: Package) => {
      this.addComponentAndChildrenToScene(child, componentOddColor, boxLayoutMap, application);
    });
  }

  addComponentAndChildrenToScene(component: Package, color: THREE.Color,
    boxLayoutMap: Map<string, BoxLayout>, application: Application) {
    const componentData = boxLayoutMap.get(component.id);
    const applicationLayout = boxLayoutMap.get(application.pid);

    if (componentData === undefined || applicationLayout === undefined) { return; }

    const {
      componentOdd: componentOddColor, componentEven: componentEvenColor,
      clazz: clazzColor, highlightedEntity: highlightedEntityColor,
    } = this.configuration.applicationColors;

    let layoutPos = new THREE.Vector3(componentData.positionX, componentData.positionY,
      componentData.positionZ);

    const mesh = new ComponentMesh(layoutPos, componentData.height, componentData.width,
      componentData.depth, component, color,
      highlightedEntityColor);

    const applicationCenter = applicationLayout.center;

    this.addMeshToScene(mesh, applicationCenter);
    this.updateMeshVisiblity(mesh);

    const clazzes = component.classes;
    const children = component.subPackages;

    clazzes.forEach((clazz) => {
      const clazzData = boxLayoutMap.get(clazz.id);

      if (clazzData === undefined) { return; }

      layoutPos = new THREE.Vector3(clazzData.positionX, clazzData.positionY, clazzData.positionZ);
      const clazzMesh = new ClazzMesh(layoutPos, clazzData.height, clazzData.width, clazzData.depth,
        clazz, clazzColor, highlightedEntityColor);
      this.addMeshToScene(clazzMesh, applicationCenter);
      this.updateMeshVisiblity(clazzMesh);
    });

    children.forEach((child: Package) => {
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
  }

  updateMeshVisiblity(mesh: ComponentMesh | ClazzMesh) {
    let parent: Package|undefined;
    if (mesh instanceof ComponentMesh) {
      parent = mesh.dataModel.parent;
    } else {
      parent = mesh.dataModel.parent;
    }

    if (parent === undefined) {
      return;
    }

    const parentMesh = this.applicationObject3D.getBoxMeshbyModelId(parent.id);
    if (parentMesh instanceof ComponentMesh) {
      mesh.visible = parentMesh.opened;
    }
  }
}
