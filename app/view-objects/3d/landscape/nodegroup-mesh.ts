import THREE from 'three';
import NodeGroup from 'explorviz-frontend/models/nodegroup';
import PlaneMesh from './plane-mesh';
import PlaneLayout from '../../layout-models/plane-layout';

export default class NodeGroupMesh extends PlaneMesh {
  dataModel: NodeGroup;

  opened: boolean;

  material: THREE.MeshBasicMaterial;

  depth: number;

  defaultZ: number;

  constructor(layout: PlaneLayout, nodeGroupModel: NodeGroup,
    defaultColor: THREE.Color, highlightingColor = new THREE.Color('red'), depth = 0, zPos = 0.01) {
    super(defaultColor, highlightingColor, layout);

    this.dataModel = nodeGroupModel;
    this.depth = depth;
    this.defaultZ = zPos;

    this.opened = layout.opened;
    this.material = new THREE.MeshBasicMaterial({ color: defaultColor });
    if (depth <= 0) {
      this.geometry = new THREE.PlaneGeometry(layout.width, layout.height);
    } else {
      this.geometry = new THREE.BoxGeometry(layout.width, layout.height, depth);
    }
  }

  setToDefaultPosition(centerPoint: THREE.Vector2) {
    const centerX = this.layout.positionX + this.layout.width / 2 - centerPoint.x;
    const centerY = this.layout.positionY - this.layout.height / 2 - centerPoint.y;

    this.position.set(centerX, centerY, this.defaultZ);
  }
}
