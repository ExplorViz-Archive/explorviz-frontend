import THREE from 'three';
import Landscape from 'explorviz-frontend/models/landscape';
import SystemMesh from './system-mesh';
import NodeGroupMesh from './nodegroup-mesh';
import NodeMesh from './node-mesh';
import ApplicationMesh from './application-mesh';

export default class LandscapeObject3D extends THREE.Object3D {
  dataModel: Landscape;

  modelIdToMesh: Map<string, THREE.Mesh> = new Map();

  openableMeshes: Set<SystemMesh|NodeGroupMesh> = new Set();

  constructor(landscape: Landscape) {
    super();

    this.dataModel = landscape;
  }

  add(object: THREE.Object3D) {
    super.add(object);

    // Ensure fast access to landscape meshes by storing them in maps
    if (object instanceof SystemMesh || object instanceof NodeGroupMesh) {
      this.openableMeshes.add(object);
      this.modelIdToMesh.set(object.dataModel.id, object);
    } else if (object instanceof NodeMesh
        || object instanceof ApplicationMesh) {
      this.modelIdToMesh.set(object.dataModel.id, object);
    }

    return this;
  }

  getMeshbyModelId(id: string) {
    return this.modelIdToMesh.get(id);
  }

  resetMeshReferences() {
    this.modelIdToMesh.clear();
    this.openableMeshes.clear();
  }

  removeAllChildren() {
    function removeChildren(entity: THREE.Object3D | THREE.Mesh) {
      for (let i = entity.children.length - 1; i >= 0; i--) {
        const child = entity.children[i];

        removeChildren(child);

        if (!(child instanceof THREE.Light)) {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            } else {
              for (let j = 0; j < child.material.length; j++) {
                const material = child.material[j];
                material.dispose();
              }
            }
          }
          entity.remove(child);
        }
      }
    }

    removeChildren(this);
  }

  get openEntityIds() {
    const openEntityIds: Set<string> = new Set();

    const { openableMeshes } = this;
    openableMeshes.forEach((openableMesh) => {
      if (openableMesh.opened) {
        openEntityIds.add(openableMesh.dataModel.id);
      }
    });

    return openEntityIds;
  }
}
