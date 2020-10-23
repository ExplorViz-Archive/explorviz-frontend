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

/**
 * This extended Object3D adds additional functionality to
 * add and retrieve landscape regarded meshes efficiently and
 * some functionality to easily remove child meshes and dispose
 * all their THREE.Geometry's and THREE.Material's.
 */
export default class LandscapeObject3D extends THREE.Object3D {
  dataModel: Landscape;

  modelIdToMesh: Map<string, THREE.Mesh> = new Map();

  openEntityIds: Set<string>;

  constructor(landscape: Landscape) {
    super();

    this.dataModel = landscape;

    this.openEntityIds = new Set();
    this.setInitialLandscapeState();
  }

  /**
   * Adds object as child of this object.
   * Furthermore, application related meshes are stored inside
   * the class's {@link modelIdToMesh} map for easier future access.
   *
   * @param object Object to add as child
   */
  add(object: THREE.Object3D) {
    super.add(object);

    // Ensure fast access to landscape meshes by additionally storing them in maps
    if (object instanceof SystemMesh || object instanceof NodeGroupMesh) {
      this.modelIdToMesh.set(object.dataModel.id, object);
    } else if (object instanceof NodeMesh
        || object instanceof ApplicationMesh) {
      this.modelIdToMesh.set(object.dataModel.id, object);
    }

    return this;
  }

  /**
   * Returns Sytem, NodeGroup, Node or Application mesh matching given id
   *
   * @param id The id of Sytem, NodeGroup, Node or Application
   */
  getMeshbyModelId(id: string) {
    return this.modelIdToMesh.get(id);
  }

  /**
   * Resets all maps and sets governing meshes
   */
  resetMeshReferences() {
    this.modelIdToMesh.clear();
  }

  /**
   * Removes all child meshes and disposes their geometries and materials
   */
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

  markAllSystemsAsClosed() {
    this.dataModel.systems.forEach((system) => {
      const systemMesh = this.getMeshbyModelId(system.id);
      if (systemMesh instanceof SystemMesh) systemMesh.opened = false;
    });
  }

  isEmpty() {
    return this.modelIdToMesh.size === 0;
  }

  setInitialLandscapeState() {
    const { systems } = this.dataModel;
    if (systems) {
      systems.forEach((system) => {
        this.openEntityIds.add(system.id);
        const nodeGroups = system.nodegroups;

        nodeGroups.forEach((nodeGroup: NodeGroup) => {
          this.openEntityIds.add(nodeGroup.id);
        });
      });
    }
  }

  /**
   * Computes a minimum bounding rectangle for the layouted landscape
   */
  getMinMaxRect(modelIdToLayout: Map<string, PlaneLayout>) {
    // Rectangle which can be used to find smallest and greatest x/y coordinates
    const rect = new MinMaxRectangle();

    const systems = this.dataModel.get('systems');

    // Set default values
    if (systems.get('length') === 0) {
      rect.setMinValues(0, 0);
      rect.setMaxValues(1, 1);
    } else {
      // Check systems for new min/max position
      systems.forEach((system: any) => {
        const systemLayout = modelIdToLayout.get(system.get('id'));
        if (systemLayout) {
          rect.setMinMaxFromLayout(systemLayout);
        }

        // Check nodegroups for new min/max position
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
