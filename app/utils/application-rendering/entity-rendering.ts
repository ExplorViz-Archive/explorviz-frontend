import THREE from 'three';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import Clazz from 'explorviz-frontend/models/clazz';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import Component from 'explorviz-frontend/models/component';
import Configuration from 'explorviz-frontend/services/configuration';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';

export default class EntityRendering {
  // Service to access color preferences
  configuration: Configuration;

  openedComponentHeight: number;

  constructor(configuration: Configuration, openedComponentHeight = 1.5) {
    this.configuration = configuration;
    this.openedComponentHeight = openedComponentHeight;
  }

  addFoundationAndChildrenToApplication(applicationMesh: ApplicationObject3D) {
    const application = applicationMesh.dataModel;

    const applicationLayout = applicationMesh.layout;
    applicationLayout.height = this.openedComponentHeight;

    if (!applicationLayout) { return; }

    // Access color preferences
    const {
      foundation: foundationColor,
      componentOdd: componentOddColor,
      highlightedEntity: highlightedEntityColor,
    } = this.configuration.applicationColors;

    const mesh = new FoundationMesh(applicationLayout,
      application, foundationColor, highlightedEntityColor);

    EntityRendering.addMeshToApplication(mesh, applicationMesh);

    const children = application.get('components');

    children.forEach((child: Component) => {
      this.addComponentAndChildrenToScene(child, componentOddColor, applicationMesh);
    });
  }

  addComponentAndChildrenToScene(component: Component, color: THREE.Color,
    applicationMesh: ApplicationObject3D) {
    const application = applicationMesh.dataModel;
    const componentLayout = applicationMesh.getBoxLayout(component.id);
    const applicationLayout = applicationMesh.getBoxLayout(application.id);

    if (!componentLayout || !applicationLayout) { return; }

    const {
      componentOdd: componentOddColor, componentEven: componentEvenColor,
      clazz: clazzColor, highlightedEntity: highlightedEntityColor,
    } = this.configuration.applicationColors;

    const mesh = new ComponentMesh(componentLayout, component, color,
      highlightedEntityColor);

    EntityRendering.addMeshToApplication(mesh, applicationMesh);
    EntityRendering.updateMeshVisiblity(mesh, applicationMesh);

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz: Clazz) => {
      const clazzLayout = applicationMesh.getBoxLayout(clazz.get('id'));

      if (!clazzLayout) { return; }

      const clazzMesh = new ClazzMesh(clazzLayout, clazz, clazzColor, highlightedEntityColor);
      EntityRendering.addMeshToApplication(clazzMesh, applicationMesh);
      EntityRendering.updateMeshVisiblity(clazzMesh, applicationMesh);
    });

    children.forEach((child: Component) => {
      if (color === componentEvenColor) {
        this.addComponentAndChildrenToScene(child, componentOddColor, applicationMesh);
      } else {
        this.addComponentAndChildrenToScene(child, componentEvenColor, applicationMesh);
      }
    });
  } // END addComponentToScene

  static addMeshToApplication(mesh: ComponentMesh | ClazzMesh | FoundationMesh,
    applicationMesh: ApplicationObject3D) {
    const layoutPosition = mesh.layout.position;
    const applicationCenter = applicationMesh.layout.center;

    const centerPoint = new THREE.Vector3(
      layoutPosition.x + mesh.layout.width / 2.0,
      layoutPosition.y + mesh.layout.height / 2.0,
      layoutPosition.z + mesh.layout.depth / 2.0,
    );

    centerPoint.sub(applicationCenter);

    mesh.position.copy(centerPoint);

    applicationMesh.add(mesh);
  }

  static updateMeshVisiblity(mesh: ComponentMesh | ClazzMesh,
    applicationMesh: ApplicationObject3D) {
    let parent: Component;
    if (mesh instanceof ComponentMesh) {
      parent = mesh.dataModel.parentComponent;
    } else {
      parent = mesh.dataModel.parent;
    }
    const parentMesh = applicationMesh.getBoxMeshbyModelId(parent.get('id'));
    if (parentMesh instanceof ComponentMesh) {
      mesh.visible = parentMesh.opened;
    }
  }
}
