import THREE from 'three';
import Landscape from 'explorviz-frontend/models/landscape';
import MinMaxRectangle from 'explorviz-frontend/view-objects/layout-models/min-max-rectangle';
import PlaneLayout from 'explorviz-frontend/view-objects/layout-models/plane-layout';
import NodeGroup from 'explorviz-frontend/models/nodegroup';
import Node from 'explorviz-frontend/models/node';
import SystemMesh from './system-mesh';
import NodeGroupMesh from './nodegroup-mesh';
import NodeMesh from './node-mesh';
import ApplicationMesh from './application-mesh';
import BaseMesh from '../base-mesh';

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

    // Ensure fast access to landscape meshes by additionally storing them in maps
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

  /**
   * Iterates over all openable meshes which are currently added to the
   * landscape and returns a set with ids of the opened meshes.
   * Returns all openable mesh ids if landscape has not yet been layouted.
   */
  get openEntityIds() {
    const openEntityIds: Set<string> = new Set();

    // If Landscape is computed for the first time,
    // all Systems & NodeGroups shall be opened
    if (this.modelIdToMesh.size === 0) {
      const { systems } = this.dataModel;
      if (systems) {
        systems.forEach((system) => {
          openEntityIds.add(system.id);
          const nodeGroups = system.nodegroups;

          nodeGroups.forEach((nodeGroup: NodeGroup) => {
            openEntityIds.add(nodeGroup.id);
          });
        });
      }
    // Determine which Systems & NodeGroups are opened
    } else {
      const { openableMeshes } = this;
      openableMeshes.forEach((openableMesh) => {
        if (openableMesh.opened) {
          openEntityIds.add(openableMesh.dataModel.id);
        }
      });
    }

    return openEntityIds;
  }

  getMinMaxRect(modelIdToLayout: Map<string, PlaneLayout>) {
    // Rectangle which can be used to find smallest and greatest x/y coordinates
    const rect = new MinMaxRectangle();

    const systems = this.dataModel.get('systems');

    if (systems.get('length') === 0) {
      rect.setMinValues(0, 0);
      rect.setMaxValues(1, 1);
    } else {
      systems.forEach((system: any) => {
        const systemLayout = modelIdToLayout.get(system.get('id'));
        if (systemLayout) {
          rect.setMinMaxFromLayout(systemLayout);
        }

        const nodegroups = system.get('nodegroups');
        nodegroups.forEach((nodegroup: NodeGroup) => {
          const nodes = nodegroup.get('nodes');
          nodes.forEach((node: Node) => {
            const nodeLayout = modelIdToLayout.get(node.get('id'));
            if (nodeLayout) {
              rect.setMinMaxFromLayout(nodeLayout);
            }
          });
        });
      });
    }
    return rect;
  }
}
