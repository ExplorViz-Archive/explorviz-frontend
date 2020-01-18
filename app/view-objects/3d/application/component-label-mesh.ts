import THREE from "three";
import LabelMesh from "../label-mesh";
import ComponentMesh from "./component-mesh";

export default class ComponentLabelMesh extends LabelMesh {

  constructor(font: THREE.Font, labelText: string, textColor = new THREE.Color(0x000000), componentMesh: ComponentMesh) {
    super(font, labelText, textColor);
    this.computeLabel(componentMesh, labelText);
  }

  computeLabel(componentMesh: ComponentMesh, labelText: string) {
    const MIN_HEIGHT = 1.5;
    const MIN_LENGTH = 4;

    let parentScale = componentMesh.scale;

    let parentAspectRatio = parentScale.x / parentScale.z;

    // Adjust desired text size with possible scaling
    const textSize = (2.0 / parentScale.x) * parentAspectRatio;
    // Text should look like it is written on the parent's box (no height required)
    const textHeight = 0.0;

    this.geometry = new THREE.TextGeometry(labelText, {
      font: this.font,
      size: textSize,
      height: textHeight,
      curveSegments: 1,
    });

    this.material = new THREE.MeshBasicMaterial({ color: this.defaultColor })

    let textDimensions = computeBoxSize(this.geometry);
    let textWidth = textDimensions.x;

    let scaleFactor = 1;

    // Handle too long labels, expect labels to be (at most) 90% the width of the parent's mesh
    let desiredWith = componentMesh.geometry.parameters.depth * 0.90;
    if (textWidth > desiredWith) {
      scaleFactor = desiredWith / textWidth;
      this.geometry.scale(scaleFactor, scaleFactor, scaleFactor);

      // Update text dimensions
      textDimensions = computeBoxSize(this.geometry)
    }

    // Text height as percepted by the user
    let absoluteTextHeight = textSize * parentScale.x * scaleFactor;

    // Shorten label string if scaling obliterated label
    if (absoluteTextHeight < MIN_HEIGHT && labelText.length > MIN_LENGTH && !labelText.includes('...')) {
      // Dispose objects because new text object needs to be computed
      this.geometry.dispose();
      this.material.dispose();

      // Calculate theoretical label length based on height mismatch
      let desiredLength = (absoluteTextHeight / MIN_HEIGHT) * Math.floor(labelText.length);
      let shortenedLabel = labelText.substring(0, desiredLength - 1) + '...';

      // Recursive call to reuse existing code
      this.computeLabel(componentMesh, shortenedLabel);
      return;
    }

    /**
     * Updates bounding box of geometry and returns respective dimensions
     */
    function computeBoxSize(geometry: THREE.Geometry | THREE.BufferGeometry) {
      geometry.computeBoundingBox();
      let boxDimensions = new THREE.Vector3();
      geometry.boundingBox.getSize(boxDimensions);
      return { x: boxDimensions.x, y: boxDimensions.y, z: boxDimensions.z };
    }
  }
}