import Component from 'explorviz-frontend/models/component';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import * as Labeler from 'explorviz-frontend/utils/application-rendering/labeler';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import THREE, { PerspectiveCamera } from 'three';
import ClazzCommunication from 'explorviz-frontend/models/clazzcommunication';
import Clazz from 'explorviz-frontend/models/clazz';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import DS from 'ember-data';
import CommunicationRendering from './communication-rendering';
import Highlighting from './highlighting';

export default class EntityManipulation {
  // Functions as parent object for all application objects
  applicationObject3D: ApplicationObject3D;

  // References to apply necessary communications to communication and highlighting
  communicationRendering: CommunicationRendering;

  highlighter: Highlighting;

  constructor(applicationObject3D: ApplicationObject3D,
    communicationRendering: CommunicationRendering, highlighter: Highlighting) {
    this.applicationObject3D = applicationObject3D;
    this.communicationRendering = communicationRendering;
    this.highlighter = highlighter;
  }

  closeAllComponents(boxLayoutMap: Map<string, BoxLayout>) {
    const application = this.applicationObject3D.dataModel;

    // Close each component
    application.components.forEach((component) => {
      const componentMesh = this.applicationObject3D.getBoxMeshbyModelId(component.id);
      if (componentMesh instanceof ComponentMesh) {
        this.closeComponentMesh(componentMesh);
      }
    });

    // Re-compute communication and highlighting
    this.communicationRendering.addCommunication(boxLayoutMap);
    this.highlighter.updateHighlighting();
  }

  openComponentsRecursively(component: Component) {
    const components = component.children;
    components.forEach((child) => {
      const mesh = this.applicationObject3D.getBoxMeshbyModelId(child.get('id'));
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
      const childMesh = this.applicationObject3D.getBoxMeshbyModelId(childComponent.get('id'));
      if (childMesh) {
        childMesh.visible = true;
      }
    });

    const clazzes = mesh.dataModel.get('clazzes');
    clazzes.forEach((clazz) => {
      const childMesh = this.applicationObject3D.getBoxMeshbyModelId(clazz.get('id'));
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
      const childMesh = this.applicationObject3D.getBoxMeshbyModelId(childComponent.get('id'));
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
      const childMesh = this.applicationObject3D.getBoxMeshbyModelId(clazz.get('id'));
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
      const sourceClazzMesh = this.applicationObject3D.getBoxMeshbyModelId(emberModel.sourceClazz.get('id'));
      const targetClazzMesh = this.applicationObject3D.getBoxMeshbyModelId(emberModel.targetClazz.get('id'));

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
      const clazzMesh = this.applicationObject3D.getBoxMeshbyModelId(emberModel.get('id'));
      if (clazzMesh instanceof ClazzMesh) {
        const layoutPos = new THREE.Vector3().copy(clazzMesh.layoutPos);
        EntityManipulation.applyCameraPosition(applicationCenter, camera, layoutPos,
          applicationObject3D);
        // Apply zoom
        camera.position.z += 25;
      }
    }
  }

  /**
   * Opens components of the application until at least two components are visible.
   */
  applyDefaultApplicationLayout() {
    const self = this;

    function applyComponentLayout(components: DS.PromiseManyArray<Component>) {
      if (components.length > 1) {
        // There are two components on the first level
        // therefore, here is nothing to do
        return;
      }

      const component = components.objectAt(0);

      if (component !== undefined) {
        const mesh = self.applicationObject3D.getBoxMeshbyModelId(component.id);
        if (mesh instanceof ComponentMesh) {
          self.openComponentMesh(mesh);
        }

        applyComponentLayout(component.get('children'));
      }
    }

    applyComponentLayout(this.applicationObject3D.dataModel.components);
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
}
