import BaseMesh from "explorviz-frontend/view-objects/3d/base-mesh";
import THREE from "three";
import * as Helper from '../vr-helpers/multi-user-helper';
import { VRControllerLabelPosition } from "./vr-controller-label-positions";

export default class VRControllerLabelMesh extends BaseMesh {
  canvas: HTMLCanvasElement;

  constructor(label: string, labelPosition: VRControllerLabelPosition) {
    super();

    // Set width and height based on text size.
    const font = '30px arial';
    const textSize = Helper.getTextSize(label, font);
    const padding = 10;
    const width = textSize.width + padding;
    const height = textSize.height + padding;

    const worldWidth = width / 512 * 0.15;
    const worldHeight = height / 512 * 0.15;
    this.geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);

    // Fill background with default menu background color.
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x444444),
      side: THREE.DoubleSide
    });

    // Use canvas to display text.
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    // Write white text into canvas.
    ctx.font = font;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(label, width / 2, height - padding);

    // Create a new mesh whose texture is the canvas such that the text
    // is not visible from the back.
    const geometry = this.geometry.clone();
    const material = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(this.canvas),
      depthTest: true
    });
    material.transparent = true;
    const canvasMesh = new THREE.Mesh(geometry, material);

    // Move the canvas slightly in front of the background.
    canvasMesh.position.z = 0.001;
    this.add(canvasMesh);

    // Make label slightly transparent.
    this.material.transparent = true;
    this.material.opacity = 0.8;

    // Move label to the left or right of the controller.
    // There is a 5cm padding between the label and the controller.
    const labelOffset = labelPosition.offsetDirection * worldWidth / 2;
    const labelPadding = labelPosition.offsetDirection * 0.05;
    this.position.copy(labelPosition.buttonPosition);
    this.translateX(labelOffset + labelPadding);

    // Draw a line from the edge of the label to the button.
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-(labelOffset + labelPadding), 0, 0),
      new THREE.Vector3(-labelOffset, 0, 0),
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x444444),
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    this.add(line);

    // Rotate such that the label faces up.
    this.rotateX(-90 * THREE.MathUtils.DEG2RAD);
  }
}
