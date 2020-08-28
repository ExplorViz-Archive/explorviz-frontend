import Component from 'explorviz-frontend/models/component';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import * as Labeler from 'explorviz-frontend/utils/application-rendering/labeler';
import THREE, { PerspectiveCamera } from 'three';
import ClazzCommunication from 'explorviz-frontend/models/clazzcommunication';
import Clazz from 'explorviz-frontend/models/clazz';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import DS from 'ember-data';
import CommunicationRendering from './communication-rendering';
import Highlighting from './highlighting';

export default class EntityManipulation {
  // References to apply necessary communications to communication and highlighting
  communicationRendering: CommunicationRendering;

  highlighter: Highlighting|null;

  openedComponentHeight: number;

  constructor(communicationRendering: CommunicationRendering, highlighter: Highlighting|null,
    heightOfComponent = 1.5) {
    this.communicationRendering = communicationRendering;
    this.highlighter = highlighter;
    this.openedComponentHeight = heightOfComponent;
  }

  /**
   * Closes all component meshes which are currently added to the applicationObject3D
   * and re-adds the communication.
   *
   * @param boxLayoutMap Contains layout information for re-computation of communication
   */
  closeAllComponents(applicationObject3D: ApplicationObject3D) {
    const application = applicationObject3D.dataModel;

    // Close each component
    application.components.forEach((component) => {
      const componentMesh = applicationObject3D.getBoxMeshbyModelId(component.id);
      if (componentMesh instanceof ComponentMesh) {
        this.closeComponentMesh(componentMesh, applicationObject3D);
      }
    });

    // Re-compute communication and highlighting
    this.communicationRendering.addCommunication(applicationObject3D);
    if (this.highlighter) {
      this.highlighter.updateHighlighting();
    }
  }

  /**
   * Takes a component and open all children component meshes recursively
   *
   * @param component Component of which the children shall be opened
   */
  openComponentsRecursively(component: Component, applicationObject3D: ApplicationObject3D) {
    const components = component.children;
    components.forEach((child) => {
      const mesh = applicationObject3D.getBoxMeshbyModelId(child.get('id'));
      if (mesh !== undefined && mesh instanceof ComponentMesh) {
        this.openComponentMesh(mesh, applicationObject3D);
      }
      this.openComponentsRecursively(child, applicationObject3D);
    });
  }

  /**
   * Opens a given component mesh.
   *
   * @param mesh Component mesh which shall be opened
   */
  openComponentMesh(mesh: ComponentMesh, applicationObject3D: ApplicationObject3D) {
    if (mesh.opened) { return; }

    mesh.height = this.openedComponentHeight;

    // Reset y coordinate
    mesh.position.y -= mesh.layout.height / 2;
    // Set y coordinate according to open component height
    mesh.position.y += this.openedComponentHeight / 2;

    mesh.opened = true;
    mesh.visible = true;
    Labeler.positionBoxLabel(mesh);

    const childComponents = mesh.dataModel.get('children');
    childComponents.forEach((childComponent) => {
      const childMesh = applicationObject3D.getBoxMeshbyModelId(childComponent.get('id'));
      if (childMesh) {
        childMesh.visible = true;
      }
    });

    const clazzes = mesh.dataModel.get('clazzes');
    clazzes.forEach((clazz) => {
      const childMesh = applicationObject3D.getBoxMeshbyModelId(clazz.get('id'));
      if (childMesh) {
        childMesh.visible = true;
      }
    });
  }

  /**
   * Closes a given component mesh.
   *
   * @param mesh Component mesh which shall be closed
   */
  closeComponentMesh(mesh: ComponentMesh, applicationObject3D: ApplicationObject3D) {
    if (!mesh.opened) { return; }

    mesh.height = mesh.layout.height;

    // Reset y coordinate
    mesh.position.y -= this.openedComponentHeight / 2;
    // Set y coordinate according to closed component height
    mesh.position.y += mesh.layout.height / 2;

    mesh.opened = false;
    Labeler.positionBoxLabel(mesh);

    const childComponents = mesh.dataModel.get('children');
    childComponents.forEach((childComponent) => {
      const childMesh = applicationObject3D.getBoxMeshbyModelId(childComponent.get('id'));
      if (childMesh instanceof ComponentMesh) {
        childMesh.visible = false;
        if (childMesh.opened) {
          this.closeComponentMesh(childMesh, applicationObject3D);
        }
        // Reset highlighting if highlighted entity is no longer visible
        if (childMesh.highlighted && this.highlighter) {
          this.highlighter.removeHighlighting();
        }
      }
    });

    const clazzes = mesh.dataModel.get('clazzes');
    clazzes.forEach((clazz) => {
      const childMesh = applicationObject3D.getBoxMeshbyModelId(clazz.get('id'));
      if (childMesh instanceof ClazzMesh) {
        childMesh.visible = false;
        // Reset highlighting if highlighted entity is no longer visible
        if (childMesh.highlighted && this.highlighter) {
          this.highlighter.removeHighlighting();
        }
      }
    });
  }

  /**
   * Opens a component mesh which is closed and vice versa
   *
   * @param mesh Mesh which shall be opened / closed
   */
  toggleComponentMeshState(mesh: ComponentMesh, applicationObject3D: ApplicationObject3D) {
    if (mesh.opened) {
      this.closeComponentMesh(mesh, applicationObject3D);
    } else {
      this.openComponentMesh(mesh, applicationObject3D);
    }
  }

  /**
   * Takes a set of open component ids and opens them.
   *
   * @param openComponentids Set with ids of components which shall be opened
   * @param boxLayoutMap Map which contains communication layout
   */
  setComponentState(applicationObject3D: ApplicationObject3D) {
    const { openComponentIds } = applicationObject3D;

    openComponentIds.forEach((componentId) => {
      const componentMesh = applicationObject3D.getBoxMeshbyModelId(componentId);
      if (componentMesh instanceof ComponentMesh) {
        this.openComponentMesh(componentMesh, applicationObject3D);
      }
    });
  }

  /**
   * Moves camera such that a specified model is in focus
   *
   * @param emberModel Model of interest
   * @param applicationCenter Offset for position calculation
   * @param camera Camera which shall be moved
   * @param applicationObject3D Object which contains all application meshes
   */
  static moveCameraTo(emberModel: Clazz|ClazzCommunication, applicationCenter: THREE.Vector3,
    camera: PerspectiveCamera, applicationObject3D: ApplicationObject3D) {
    if (emberModel instanceof ClazzCommunication) {
      const sourceClazzMesh = applicationObject3D.getBoxMeshbyModelId(emberModel.sourceClazz.get('id'));
      const targetClazzMesh = applicationObject3D.getBoxMeshbyModelId(emberModel.targetClazz.get('id'));

      if (sourceClazzMesh instanceof ClazzMesh && targetClazzMesh instanceof ClazzMesh) {
        const sourceLayoutPos = new THREE.Vector3().copy(sourceClazzMesh.layout.position);
        const targetLayoutPos = new THREE.Vector3().copy(targetClazzMesh.layout.position);

        const directionVector = targetLayoutPos.sub(sourceLayoutPos);

        const middleLayoutPos = sourceLayoutPos.add(directionVector.divideScalar(2));
        EntityManipulation.applyCameraPosition(applicationCenter, camera, middleLayoutPos,
          applicationObject3D);
        // Apply zoom
        camera.position.z += 50;
      }
    } else {
      const clazzMesh = applicationObject3D.getBoxMeshbyModelId(emberModel.get('id'));
      if (clazzMesh instanceof ClazzMesh) {
        const layoutPos = new THREE.Vector3().copy(clazzMesh.layout.position);
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
  applyDefaultApplicationLayout(applicationObject3D: ApplicationObject3D) {
    const self = this;

    function applyComponentLayout(appObject3D: ApplicationObject3D,
      components: DS.PromiseManyArray<Component>) {
      if (components.length > 1) {
        // There are two components on the first level
        // therefore, here is nothing to do
        return;
      }

      const component = components.objectAt(0);

      if (component !== undefined) {
        const mesh = appObject3D.getBoxMeshbyModelId(component.id);
        if (mesh instanceof ComponentMesh) {
          self.openComponentMesh(mesh, applicationObject3D);
        }

        applyComponentLayout(appObject3D, component.get('children'));
      }
    }

    applyComponentLayout(applicationObject3D, applicationObject3D.dataModel.components);
  }

  /**
   * Moves camera to a specified position.
   *
   * @param centerPoint Offset of application
   * @param camera Camera which shall be positioned
   * @param layoutPos Desired position
   * @param applicationObject3D Contains all application meshes
   */
  static applyCameraPosition(centerPoint: THREE.Vector3, camera: THREE.PerspectiveCamera,
    layoutPos: THREE.Vector3, applicationObject3D: ApplicationObject3D) {
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
