import THREE from 'three';
import { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import CommunicationLayout from '../../layout-models/communication-layout';
import BaseMesh from '../base-mesh';
import CommunicationArrowMesh from './communication-arrow-mesh';

export default class ClazzCommunicationMesh extends BaseMesh {
  dataModel: DrawableClassCommunication;

  layout: CommunicationLayout;

  constructor(layout: CommunicationLayout, dataModel: DrawableClassCommunication,
    defaultColor: THREE.Color, highlightingColor: THREE.Color) {
    super(defaultColor, highlightingColor);
    this.layout = layout;
    this.dataModel = dataModel;

    this.material = new THREE.MeshBasicMaterial({
      color: defaultColor,
    });
  }

  /**
   * Turns the mesh and its arrows transparent, if value in [0,1). Fully transparent at 0.0
   *
   * @param opacity Desired transparency of mesh and its arrows. Default 0.3
   */
  turnTransparent(opacity = 0.3) {
    super.turnTransparent(opacity);
    this.children.forEach((childObject) => {
      if (childObject instanceof CommunicationArrowMesh) {
        childObject.turnTransparent(opacity);
      }
    });
  }

  /**
   * Turns mesh and communication arrows back to fully opaque.
   */
  turnOpaque() {
    super.turnOpaque();
    this.children.forEach((childObject) => {
      if (childObject instanceof CommunicationArrowMesh) {
        childObject.turnOpaque();
      }
    });
  }

  /**
   * Renders the communication mesh as straight cylinder geometry.
   *
   * @param applicationCenter The center point of the application
   */
  renderAsLine(applicationCenter: THREE.Vector3) {
    const { layout } = this;
    const { startPoint } = layout;
    const { endPoint } = layout;

    const start = new THREE.Vector3();
    start.subVectors(startPoint, applicationCenter);

    const end = new THREE.Vector3();
    end.subVectors(endPoint, applicationCenter);

    const direction = new THREE.Vector3().subVectors(end, start);
    const orientation = new THREE.Matrix4();
    orientation.lookAt(start, end, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1,
      0, 0, -1, 0, 0, 0, 0, 0, 1));

    const { lineThickness } = layout;
    const edgeGeometry = new THREE.CylinderGeometry(lineThickness, lineThickness,
      direction.length(), 20, 1);
    this.geometry = edgeGeometry;
    this.applyMatrix4(orientation);

    // Set position to center of pipe
    this.position.copy(end.add(start).divideScalar(2));
  }

  /**
   * Renders the communication mesh as straight cylinder geometry.
   *
   * @param applicationCenter The center point of the application.
   * @param curveHeight Max height of the communication. Default 0.0
   * @param desiredSegments The number of segments (tubes) the geometry persists of. Default 20
   */
  render(applicationCenter = new THREE.Vector3(), curveHeight = 0.0, desiredSegments = 20) {
    const { layout } = this;

    const start = new THREE.Vector3();
    start.subVectors(layout.startPoint, applicationCenter);

    const end = new THREE.Vector3();
    end.subVectors(layout.endPoint, applicationCenter);

    // Determine middle
    const dir = end.clone().sub(start);
    const length = dir.length();
    const halfVector = dir.normalize().multiplyScalar(length * 0.5);
    const middle = start.clone().add(halfVector);
    middle.y += curveHeight;

    const curve = new THREE.QuadraticBezierCurve3(
      start,
      middle,
      end,
    );

    let curveSegments = desiredSegments;
    // Render straigt tube if curve height of 0.0 is provided
    if (curveHeight === 0.0) {
      curveSegments = 1;
    }

    this.geometry = new THREE.TubeGeometry(curve, curveSegments, layout.lineThickness);
  }

  /**
   * Adds communication arrows on top of the communication mesh
   * to visualize communication direction
   *
   * @param applicationCenter The application's center point
   * @param width The width of the arrow. Default 1.0
   * @param yOffset Units to move the communication arrows up by. Default 1.0
   * @param color The color of the arrows. Default black
   */
  addArrows(applicationCenter = new THREE.Vector3(), width = 1, yOffset = 1, color = 0x000000) {
    const { layout } = this;
    // Scale arrow with communication line thickness
    const { startPoint } = layout;
    const { endPoint } = layout;

    const arrowWidth = width + layout.lineThickness / 2;

    const start = new THREE.Vector3();
    start.subVectors(startPoint, applicationCenter);

    const end = new THREE.Vector3();
    end.subVectors(endPoint, applicationCenter);

    this.addArrow(start, end, arrowWidth, yOffset, color);

    // Add 2nd arrow to visualize bidirectional communication
    if (this.dataModel.bidirectional) {
      this.addArrow(end, start, arrowWidth, yOffset, color);
    }
  }

  /**
   * Adds a single communication arrow.
   *
   * @param start The start point of the communication.
   * @param end The end point of the communication.
   * @param width The width of the arrow.
   * @param yOffset Units to move the communication arrow up by. Default 1.0
   * @param color The color of the arrow.
   */
  private addArrow(start: THREE.Vector3, end: THREE.Vector3,
    width: number, yOffset: number, color: number) {
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    // Do not draw precisely in the middle to leave a
    // small gap in case of bidirectional communication
    const halfVector = dir.normalize().multiplyScalar(len * 0.51);
    const middle = start.clone().add(halfVector);

    // Normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    // Arrow properties
    const origin = new THREE.Vector3(middle.x, middle.y + yOffset, middle.z);
    const headWidth = Math.max(0.5, width);
    const headLength = Math.min(2 * headWidth, 0.3 * len);
    const length = headLength + 0.00001; // body of arrow not visible

    const arrow = new CommunicationArrowMesh(this.dataModel, dir, origin, length,
      color, headLength, headWidth);
    this.add(arrow);
  }
}
