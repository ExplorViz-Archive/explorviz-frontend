import THREE from 'three';
import Node from 'explorviz-frontend/models/node';
import PlaneMesh from './plane-mesh';
import PlaneLayout from '../../layout-models/plane-layout';
import NodeGroupMesh from './nodegroup-mesh';


export default class NodeMesh extends PlaneMesh {
  dataModel: Node;

  material: THREE.MeshBasicMaterial;

  constructor(layout: PlaneLayout, nodeModel: Node,
    defaultColor: THREE.Color, highlightingColor = new THREE.Color('red')) {
    super(defaultColor, highlightingColor, layout);

    this.dataModel = nodeModel;
    this.material = new THREE.MeshBasicMaterial({ color: defaultColor });
    this.geometry = new THREE.PlaneGeometry(layout.width, layout.height);
  }

  getDisplayName(parent: THREE.Mesh | undefined) {
    const node = this.dataModel;

    // Display ip address as default name
    if (!(parent instanceof NodeGroupMesh)) {
      return node.get('ipAddress');
    }

    const parentModel = parent.dataModel;

    if (parent.opened
      && node.get('name') && node.get('name').length > 0 && !node.get('name').startsWith('<')) {
      return node.get('name');
    } if (!parent.opened) {
      // Display parent name (e.g. range of ip-addresses) if only
      // this node is visible with parent nodegroup
      return parentModel.get('name');
    }

    return node.get('ipAddress');
  }

  setToDefaultPosition(centerPoint: THREE.Vector3) {
    const centerX = this.layout.positionX + this.layout.width / 2 - centerPoint.x;
    const centerY = this.layout.positionY - this.layout.height / 2 - centerPoint.y;

    this.position.set(centerX, centerY, 0.02);
  }
}
