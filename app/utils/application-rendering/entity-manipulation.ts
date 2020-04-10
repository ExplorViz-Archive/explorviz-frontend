import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import Component from 'explorviz-frontend/models/component';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import * as Labeler from 'explorviz-frontend/utils/application-rendering/labeler';
import Application from 'explorviz-frontend/models/application';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import THREE, { PerspectiveCamera } from 'three';
import ClazzCommunication from 'explorviz-frontend/models/clazzcommunication';
import Clazz from 'explorviz-frontend/models/clazz';
import CommunicationRendering from './communication-rendering';
import Highlighting from './highlighting';

export default class EntityManipulation {
  // Reference to mesh maps of rendering
  modelIdToMesh: Map<string, BaseMesh>;

  // References to apply necessary communications to communication and highlighting
  communicationRendering: CommunicationRendering;

  highlighter: Highlighting;

  constructor(modelIdToMesh: Map<string, BaseMesh>, communicationRendering: CommunicationRendering,
    highlighter: Highlighting) {
    this.modelIdToMesh = modelIdToMesh;
    this.communicationRendering = communicationRendering;
    this.highlighter = highlighter;
  }

  closeAllComponents(application: Application, boxLayoutMap: Map<string, BoxLayout>) {
    this.modelIdToMesh.forEach((mesh) => {
      if (mesh instanceof ComponentMesh) {
        this.closeComponentMesh(mesh);
      }
    });
    this.communicationRendering.addCommunication(application, boxLayoutMap);
    this.highlighter.updateHighlighting(application);
  }

  openComponentsRecursively(component: Component) {
    const components = component.children;
    components.forEach((child) => {
      const mesh = this.modelIdToMesh.get(child.get('id'));
      if (mesh !== undefined && mesh instanceof ComponentMesh) {
        this.openComponentMesh(mesh);
      }
      this.openComponentsRecursively(child);
    });
  }

  openComponentMesh(mesh: ComponentMesh) {
    if (mesh.opened) { return; }

    const HEIGHT_OPENED_COMPONENT = 1.5;
    mesh.height = HEIGHT_OPENED_COMPONENT;

    // Reset y coordinate
    mesh.position.y -= mesh.layoutHeight / 2;
    // Set y coordinate according to open component height
    mesh.position.y += HEIGHT_OPENED_COMPONENT / 2;

    mesh.opened = true;
    mesh.visible = true;
    Labeler.positionBoxLabel(mesh);

    const childComponents = mesh.dataModel.get('children');
    childComponents.forEach((childComponent) => {
      const childMesh = this.modelIdToMesh.get(childComponent.get('id'));
      if (childMesh) {
        childMesh.visible = true;
      }
    });

    const clazzes = mesh.dataModel.get('clazzes');
    clazzes.forEach((clazz) => {
      const childMesh = this.modelIdToMesh.get(clazz.get('id'));
      if (childMesh) {
        childMesh.visible = true;
      }
    });
  }

  closeComponentMesh(mesh: ComponentMesh) {
    if (!mesh.opened) { return; }

    const HEIGHT_OPENED_COMPONENT = 1.5;
    mesh.height = mesh.layoutHeight;

    // Reset y coordinate
    mesh.position.y -= HEIGHT_OPENED_COMPONENT / 2;
    // Set y coordinate according to closed component height
    mesh.position.y += mesh.layoutHeight / 2;

    mesh.opened = false;
    Labeler.positionBoxLabel(mesh);

    const childComponents = mesh.dataModel.get('children');
    childComponents.forEach((childComponent) => {
      const childMesh = this.modelIdToMesh.get(childComponent.get('id'));
      if (childMesh instanceof ComponentMesh) {
        childMesh.visible = false;
        if (childMesh.opened) {
          this.closeComponentMesh(childMesh);
        }
        // Reset highlighting if highlighted entity is no longer visible
        if (childMesh.highlighted) {
          this.highlighter.removeHighlighting();
        }
      }
    });

    const clazzes = mesh.dataModel.get('clazzes');
    clazzes.forEach((clazz) => {
      const childMesh = this.modelIdToMesh.get(clazz.get('id'));
      if (childMesh instanceof ClazzMesh) {
        childMesh.visible = false;
        // Reset highlighting if highlighted entity is no longer visible
        if (childMesh.highlighted) {
          this.highlighter.removeHighlighting();
        }
      }
    });
  }

  moveCameraTo(emberModel: Clazz|ClazzCommunication, applicationCenter: THREE.Vector3,
    camera: PerspectiveCamera, applicationObject3D: THREE.Object3D) {
    if (emberModel instanceof ClazzCommunication) {
      const sourceClazzMesh = this.modelIdToMesh.get(emberModel.sourceClazz.get('id'));
      const targetClazzMesh = this.modelIdToMesh.get(emberModel.targetClazz.get('id'));

      if (sourceClazzMesh instanceof ClazzMesh && targetClazzMesh instanceof ClazzMesh) {
        const sourceLayoutPos = new THREE.Vector3().copy(sourceClazzMesh.layoutPos);
        const targetLayoutPos = new THREE.Vector3().copy(targetClazzMesh.layoutPos);

        const directionVector = targetLayoutPos.sub(sourceLayoutPos);

        const middleLayoutPos = sourceLayoutPos.add(directionVector.divideScalar(2));
        EntityManipulation.applyCameraPosition(applicationCenter, camera, middleLayoutPos,
          applicationObject3D);
        // Apply zoom
        camera.position.z += 50;
      }
    } else {
      const clazzMesh = this.modelIdToMesh.get(emberModel.get('id'));
      if (clazzMesh instanceof ClazzMesh) {
        const layoutPos = new THREE.Vector3().copy(clazzMesh.layoutPos);
        EntityManipulation.applyCameraPosition(applicationCenter, camera, layoutPos,
          applicationObject3D);
        // Apply zoom
        camera.position.z += 25;
      }
    }
  }

  static applyCameraPosition(centerPoint: THREE.Vector3, camera: THREE.PerspectiveCamera,
    layoutPos: THREE.Vector3, applicationObject3D: THREE.Object3D) {
    layoutPos.sub(centerPoint);
    layoutPos.multiplyScalar(0.5);

    const appQuaternion = new THREE.Quaternion();

    applicationObject3D.getWorldQuaternion(appQuaternion);
    layoutPos.applyQuaternion(appQuaternion);

    const appPosition = new THREE.Vector3();
    applicationObject3D.getWorldPosition(appPosition);
    layoutPos.sub(appPosition);

    // Move camera on to given position
    camera.position.set(layoutPos.x, layoutPos.y, layoutPos.z);
  }

  static resetAppRotation(application: THREE.Object3D) {
    const ROTATION_X = 0.65;
    const ROTATION_Y = 0.80;

    application.rotation.x = ROTATION_X;
    application.rotation.y = ROTATION_Y;
  }
}
