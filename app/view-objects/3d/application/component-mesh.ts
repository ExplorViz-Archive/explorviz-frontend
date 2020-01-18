import THREE from 'three';
import Component from 'explorviz-frontend/models/component';
import EntityMesh from '../entity-mesh';
export default class ComponentMesh extends EntityMesh {

  geometry: THREE.BoxGeometry;
  material: THREE.MeshLambertMaterial;
  dataModel: Component;
  opened: boolean = false;


  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    component: Component, defaultColor: THREE.Color, highlightingColor: THREE.Color) {

    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    let material = new THREE.MeshLambertMaterial({ color: defaultColor });
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = component;
  }


  addLabel(font: THREE.Font, color: THREE.Color = new THREE.Color(0x000000), name?: string) {
    const MIN_HEIGHT = 1.5;
    const MIN_LENGTH = 4;
    const MARGIN_BOTTOM = 0.5;

    let labelString = name ? name : this.dataModel.name;
    let parentScale = this.scale;

    let parentAspectRatio = parentScale.x / parentScale.z;

    // Adjust desired text size with possible scaling
    const textSize = (2.0 / parentScale.x) * parentAspectRatio;
    // Text should look like it is written on the parent's box (no height required)
    const textHeight = 0.0;

    let textGeometry = new THREE.TextGeometry(labelString, {
      font,
      size: textSize,
      height: textHeight,
    });

    let material = new THREE.MeshBasicMaterial({ color })

    let textMesh = new THREE.Mesh(textGeometry, material);
    let textDimensions = computeBoxSize(textGeometry);
    let textWidth = textDimensions.x;

    let scaleFactor = 1;

    // Handle too long labels, expect labels to be (at most) 90% the width of the parent's mesh
    let desiredWith = this.geometry.parameters.depth * 0.90;
    if (textWidth > desiredWith) {
      scaleFactor = desiredWith / textWidth;
      textGeometry.scale(scaleFactor, scaleFactor, scaleFactor);

      // Update text dimensions
      textDimensions = computeBoxSize(textGeometry)
    }

    // Text height as percepted by the user
    let absoluteTextHeight = textSize * parentScale.x * scaleFactor;

    // Shorten label string if scaling obliterated label
    if (absoluteTextHeight < MIN_HEIGHT && labelString.length > MIN_LENGTH && !labelString.includes('...')) {
      // Dispose objects because new text object needs to be computed
      textGeometry.dispose();
      material.dispose();

      // Calculate theoretical label length based on height mismatch
      let desiredLength = (absoluteTextHeight / MIN_HEIGHT) * Math.floor(labelString.length);
      let shortenedLabel = labelString.substring(0, desiredLength - 1) + '...';

      // Recursive call to reuse existing code
      this.addLabel(font, color, shortenedLabel);
      return;
    }

    // Note: The initial label's origin is in the center of their parent mesh

    // Position Label just above the bottom edge
    textMesh.position.x = - this.geometry.parameters.width / 2 + MARGIN_BOTTOM / parentScale.x;
    // Set y-position just above the box of the parent mesh
    textMesh.position.y = this.geometry.parameters.height / 2 + 0.01;
    // Position mesh centered (adjust for text width)
    textMesh.position.z = - textDimensions.x / 2;

    // Avoid distorted letters due to scaled parent
    textMesh.scale.y /= parentAspectRatio;

    // Align text with component parent
    textMesh.rotation.x = -(Math.PI / 2);
    textMesh.rotation.z = -(Math.PI / 2);

    this.add(textMesh);

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