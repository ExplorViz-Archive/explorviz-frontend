import THREE from 'three';
import { Node } from 'explorviz-frontend/services/landscape-listener';
import PlaneMesh from './plane-mesh';
import PlaneLayout from '../../layout-models/plane-layout';

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

  /**
   * Returns the display name for the node, which is either the node's
   * name, ip address or parent's name.
   *
   * @param parent The parent mesh of this node
   */
  getDisplayName() {
    const node = this.dataModel;

    return node.ipAddress;
  }

  setToDefaultPosition(centerPoint: THREE.Vector2) {
    const centerX = this.layout.positionX + this.layout.width / 2 - centerPoint.x;
    const centerY = this.layout.positionY - this.layout.height / 2 - centerPoint.y;

    this.position.set(centerX, centerY, 0.02);
  }
}
