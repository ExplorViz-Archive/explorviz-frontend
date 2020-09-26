import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import * as Labeler from 'explorviz-frontend/utils/application-rendering/labeler';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import THREE, { PerspectiveCamera } from 'three';
import ClazzCommunication from 'explorviz-frontend/models/clazzcommunication';
import Clazz from 'explorviz-frontend/models/clazz';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import { Package } from 'explorviz-frontend/services/landscape-listener';
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

  /**
   * Closes all component meshes which are currently added to the applicationObject3D
   * and re-adds the communication.
   *
   * @param boxLayoutMap Contains layout information for re-computation of communication
   */
  closeAllComponents(boxLayoutMap: Map<string, BoxLayout>) {
    const application = this.applicationObject3D.dataModel;

    // Close each component
    application.packages.forEach((component) => {
      const componentMesh = this.applicationObject3D.getBoxMeshbyModelId(component.id);
      if (componentMesh instanceof ComponentMesh) {
        this.closeComponentMesh(componentMesh);
      }
    });

    // Re-compute communication and highlighting
    this.communicationRendering.addCommunication(boxLayoutMap);
    this.highlighter.updateHighlighting();
  }

  /**
   * Takes a component and open all children component meshes recursively
   *
   * @param component Component of which the children shall be opened
   */
  openComponentsRecursively(component: Package) {
    const components = component.subPackages;
    components.forEach((child) => {
      const mesh = this.applicationObject3D.getBoxMeshbyModelId(child.id);
      if (mesh !== undefined && mesh instanceof ComponentMesh) {
        this.openComponentMesh(mesh);
      }
      this.openComponentsRecursively(child);
    });
  }

  /**
   * Opens a given component mesh.
   *
   * @param mesh Component mesh which shall be opened
   */
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

    const childComponents = mesh.dataModel.subPackages;
    childComponents.forEach((childComponent) => {
      const childMesh = this.applicationObject3D.getBoxMeshbyModelId(childComponent.id);
      if (childMesh) {
        childMesh.visible = true;
      }
    });

    const clazzes = mesh.dataModel.classes;
    clazzes.forEach((clazz) => {
      const childMesh = this.applicationObject3D.getBoxMeshbyModelId(clazz.id);
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

    const childComponents = mesh.dataModel.subPackages;
    childComponents.forEach((childComponent) => {
      const childMesh = this.applicationObject3D.getBoxMeshbyModelId(childComponent.id);
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

    const clazzes = mesh.dataModel.classes;
    clazzes.forEach((clazz) => {
      const childMesh = this.applicationObject3D.getBoxMeshbyModelId(clazz.id);
      if (childMesh instanceof ClazzMesh) {
        childMesh.visible = false;
        // Reset highlighting if highlighted entity is no longer visible
        if (childMesh.highlighted) {
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
  toggleComponentMeshState(mesh: ComponentMesh) {
    if (mesh.opened) {
      this.closeComponentMesh(mesh);
    } else {
      this.openComponentMesh(mesh);
    }
  }

  /**
   * Takes a set of open component ids and opens them.
   *
   * @param openComponentids Set with ids of components which shall be opened
   * @param boxLayoutMap Map which contains communication layout
   */
  setComponentState(openComponentids: Set<string>) {
    openComponentids.forEach((componentId) => {
      const componentMesh = this.applicationObject3D.getBoxMeshbyModelId(componentId);
      if (componentMesh instanceof ComponentMesh) {
        this.openComponentMesh(componentMesh);
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
  moveCameraTo(emberModel: Clazz|ClazzCommunication, applicationCenter: THREE.Vector3,
    camera: PerspectiveCamera, applicationObject3D: ApplicationObject3D) {
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

    function applyComponentLayout(components: Package[]) {
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

        applyComponentLayout(component.subPackages);
      }
    }

    applyComponentLayout(this.applicationObject3D.dataModel.packages);
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
