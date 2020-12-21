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

        // Use canvas to display text.
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;

        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;

        // Fill background with default menu background color.
        ctx.fillStyle = '#444444';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Write white text into canvas.
        ctx.font = font;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(label, width / 2, height - padding);

        // Use canvas as texture for this mesh.
        const texture = new THREE.Texture(this.canvas);
        texture.needsUpdate = true;
        this.material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        });

        const worldWidth = width / 512 * 0.15;
        const worldHeight = height / 512 * 0.15;
        this.geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);

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
