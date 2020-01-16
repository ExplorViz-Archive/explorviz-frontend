import THREE from 'three';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import CommunicationLayout from '../../view-objects/layout-models/communication-layout';
import CommunicationArrowMesh from './application/communication-arrow-mesh';

export default class CommunicationMesh extends THREE.Mesh {

  dataModel: DrawableClazzCommunication;
  layout: CommunicationLayout;

  highlighted: boolean = false;
  defaultColor: THREE.Color;
  highlightingColor: THREE.Color;

  constructor(layout: CommunicationLayout, dataModel: DrawableClazzCommunication,
    defaultColor: THREE.Color, highlightingColor: THREE.Color) {
    super();
    this.layout = layout;
    this.dataModel = dataModel;
    this.defaultColor = defaultColor;
    this.highlightingColor = highlightingColor;

    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(defaultColor)
    });
  }


  highlight() {
    this.highlighted = true;
    if (this.material instanceof THREE.MeshBasicMaterial) {
      this.material.color = this.highlightingColor;
    }
  }


  unhighlight() {
    this.highlighted = false;
    if (this.material instanceof THREE.MeshBasicMaterial) {
      this.material.color = this.defaultColor;
      this.material.transparent = false;
      this.material.opacity = 1.0;
    }
  }

  renderAsLine(viewCenterPoint: THREE.Vector3) {
    let layout = this.layout;
    let startPoint = layout.startPoint;
    let endPoint = layout.endPoint;

    const start = new THREE.Vector3();
    start.subVectors(startPoint, viewCenterPoint);

    const end = new THREE.Vector3();
    end.subVectors(endPoint, viewCenterPoint);

    const direction = new THREE.Vector3().subVectors(end, start);
    const orientation = new THREE.Matrix4();
    orientation.lookAt(start, end, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1,
      0, 0, -1, 0, 0, 0, 0, 0, 1));

    let lineThickness = layout.lineThickness;
    const edgeGeometry = new THREE.CylinderGeometry(lineThickness, lineThickness,
      direction.length(), 20, 1);
    this.geometry = edgeGeometry;
    this.applyMatrix(orientation);

    // Set position to center of pipe
    this.position.copy(end.add(start).divideScalar(2));
  }

  render(viewCenterPoint = new THREE.Vector3(), curveHeight = 0.0, curveSegments = 20) {
    let layout = this.layout;

    let start = new THREE.Vector3();
    start.subVectors(layout.startPoint, viewCenterPoint);

    let end = new THREE.Vector3();
    end.subVectors(layout.endPoint, viewCenterPoint);

    // Determine middle
    let dir = end.clone().sub(start);
    let length = dir.length();
    let halfVector = dir.normalize().multiplyScalar(length * 0.5);
    let middle = start.clone().add(halfVector);
    middle.y += curveHeight;

    let curve = new THREE.QuadraticBezierCurve3(
      start,
      middle,
      end
    );

    // Render straigt tube if curve height of 0.0 is provided
    if (curveHeight == 0.0) {
      curveSegments = 1;
    }

    this.geometry = new THREE.TubeGeometry(curve, curveSegments, layout.lineThickness);
  }

  addArrows(viewCenterPoint = new THREE.Vector3(), width = 1, yOffset = 1, color = 0x000000) {
    let layout = this.layout;
    // Scale arrow with communication line thickness
    let startPoint = layout.startPoint;
    let endPoint = layout.endPoint;
    width += layout.lineThickness / 2;

    const start = new THREE.Vector3();
    start.subVectors(startPoint, viewCenterPoint);

    const end = new THREE.Vector3();
    end.subVectors(endPoint, viewCenterPoint);

    this.addArrow(start, end, width, yOffset, color);

    // Add 2nd arrow to visualize bidirectional communication
    if (this.dataModel.isBidirectional) {
      this.addArrow(end, start, width, yOffset, color);
    }
  }

  addArrow(start: THREE.Vector3, end: THREE.Vector3, width: number, yOffset: number, color: number) {
    const dir = new THREE.Vector3().subVectors(end, start);
    let len = dir.length();
    // Do not draw precisely in the middle to leave a small gap in case of bidirectional communication
    let halfVector = dir.normalize().multiplyScalar(len * 0.51);
    let middle = start.clone().add(halfVector);

    // Normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    // Arrow properties
    let origin = new THREE.Vector3(middle.x, middle.y + yOffset, middle.z);
    let headWidth = Math.max(0.5, width);
    let headLength = Math.min(2 * headWidth, 0.3 * len);
    let length = headLength + 0.00001; // body of arrow not visible

    let arrow = new CommunicationArrowMesh(this.dataModel, dir, origin, length, color, headLength, headWidth);
    this.add(arrow);
  }

  delete() {
    if (this.parent) {
      this.parent.remove(this);
    }
    this.children.forEach(child => {
      if (child instanceof CommunicationArrowMesh) {
        child.delete();
      }
    });

    if (this.geometry) {
      this.geometry.dispose();
    }
    if (this.material instanceof THREE.Material) {
      this.material.dispose();
    }
  }

}