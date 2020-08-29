import THREE from 'three';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import Clazz from 'explorviz-frontend/models/clazz';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import Component from 'explorviz-frontend/models/component';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import { ApplicationColors } from 'explorviz-frontend/services/configuration';

export function addMeshToApplication(mesh: ComponentMesh | ClazzMesh | FoundationMesh,
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

export function updateMeshVisiblity(mesh: ComponentMesh | ClazzMesh,
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

export function addComponentAndChildrenToScene(component: Component, color: THREE.Color,
  applicationMesh: ApplicationObject3D, applicationColors: ApplicationColors) {
  const application = applicationMesh.dataModel;
  const componentLayout = applicationMesh.getBoxLayout(component.id);
  const applicationLayout = applicationMesh.getBoxLayout(application.id);

  if (!componentLayout || !applicationLayout) { return; }

  const {
    componentOdd: componentOddColor, componentEven: componentEvenColor,
    clazz: clazzColor, highlightedEntity: highlightedEntityColor,
  } = applicationColors;

  const mesh = new ComponentMesh(componentLayout, component, color,
    highlightedEntityColor);

  addMeshToApplication(mesh, applicationMesh);
  updateMeshVisiblity(mesh, applicationMesh);

  const clazzes = component.get('clazzes');
  const children = component.get('children');

  clazzes.forEach((clazz: Clazz) => {
    const clazzLayout = applicationMesh.getBoxLayout(clazz.get('id'));

    if (!clazzLayout) { return; }

    const clazzMesh = new ClazzMesh(clazzLayout, clazz, clazzColor, highlightedEntityColor);
    addMeshToApplication(clazzMesh, applicationMesh);
    updateMeshVisiblity(clazzMesh, applicationMesh);
  });

  children.forEach((child: Component) => {
    if (color === componentEvenColor) {
      addComponentAndChildrenToScene(child, componentOddColor, applicationMesh, applicationColors);
    } else {
      addComponentAndChildrenToScene(child, componentEvenColor, applicationMesh, applicationColors);
    }
  });
}

export function addFoundationAndChildrenToApplication(applicationMesh: ApplicationObject3D,
  applicationColors: ApplicationColors) {
  const application = applicationMesh.dataModel;

  const applicationLayout = applicationMesh.layout;
  applicationLayout.height = 1.5;

  if (!applicationLayout) { return; }

  const {
    foundation: foundationColor,
    componentOdd: componentOddColor,
    highlightedEntity: highlightedEntityColor,
  } = applicationColors;

  const mesh = new FoundationMesh(applicationLayout,
    application, foundationColor, highlightedEntityColor);

  addMeshToApplication(mesh, applicationMesh);

  const children = application.get('components');

  children.forEach((child: Component) => {
    addComponentAndChildrenToScene(child, componentOddColor, applicationMesh, applicationColors);
  });
}
