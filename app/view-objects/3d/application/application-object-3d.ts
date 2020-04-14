import THREE from 'three';
import Application from 'explorviz-frontend/models/application';
import FoundationMesh from './foundation-mesh';
import ClazzMesh from './clazz-mesh';
import ComponentMesh from './component-mesh';
import ClazzCommunicationMesh from './clazz-communication-mesh';
import BaseMesh from '../base-mesh';


export default class ApplicationObject3D extends THREE.Object3D {
  dataModel: Application;

  modelIdToMesh: Map<string, BaseMesh> = new Map();

  commIdToMesh: Map<string, ClazzCommunicationMesh> = new Map();

  constructor(application: Application) {
    super();

    this.dataModel = application;
  }

  resetRotation() {
    const ROTATION_X = 0.65;
    const ROTATION_Y = 0.80;

    this.rotation.x = ROTATION_X;
    this.rotation.y = ROTATION_Y;
  }

  add(object: THREE.Object3D) {
    super.add(object);

    // Ensure fast access to application meshes by additionally storing them in maps
    if (object instanceof FoundationMesh || object instanceof ComponentMesh
        || object instanceof ClazzMesh) {
      this.modelIdToMesh.set(object.dataModel.id, object);
    // Store communication separately to allow efficient iteration over meshes
    } else if (object instanceof ClazzCommunicationMesh) {
      this.commIdToMesh.set(object.dataModel.id, object);
    }

    return this;
  }

  getBoxMeshbyModelId(id: string) {
    return this.modelIdToMesh.get(id);
  }

  getBoxMeshes() {
    return new Set([...this.modelIdToMesh.values()]);
  }

  getCommMeshByModelId(id: string) {
    return this.commIdToMesh.get(id);
  }

  getCommMeshes() {
    return new Set([...this.commIdToMesh.values()]);
  }

  getAllMeshes(): Set<BaseMesh> {
    return new Set([...this.getBoxMeshes(), ...this.getCommMeshes()]);
  }

  resetMeshReferences() {
    this.modelIdToMesh.clear();
    this.commIdToMesh.clear();
  }

  removeAllCommunication() {
    this.getCommMeshes().forEach((mesh) => {
      mesh.delete();
    });
    this.commIdToMesh.clear();
  }

  removeAllEntities() {
    this.getBoxMeshes().forEach((mesh) => {
      mesh.delete();
    });
    this.getCommMeshes().forEach((mesh) => {
      mesh.delete();
    });
    this.resetMeshReferences();
  }
}
