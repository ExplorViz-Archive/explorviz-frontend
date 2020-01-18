import THREE from 'three';
import Component from 'explorviz-frontend/models/component';
import BoxMesh from './box-mesh';
import ComponentLabelMesh from './component-label-mesh';
export default class ComponentMesh extends BoxMesh {

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

  createLabel(font: THREE.Font){
    let label = new ComponentLabelMesh(font, this.dataModel.name, new THREE.Color(0x000000), this);

    this.positionLabel(label);
    this.add(label);
  }

  positionLabel(label: ComponentLabelMesh){
    const MARGIN_BOTTOM = 0.7;
    let aspectRatio = this.scale.x / this.scale.z;
    let textDimensions = new THREE.Vector3();
    label.geometry.boundingBox.getSize(textDimensions)

    // Note: The initial label's origin is in the center of their parent mesh

    // Position Label just above the bottom edge
    label.position.x = - this.geometry.parameters.width / 2 + MARGIN_BOTTOM / this.scale.x;
    // Set y-position just above the box of the parent mesh
    label.position.y = this.geometry.parameters.height / 2 + 0.01;
    // Position mesh centered (adjust for text width)
    label.position.z = - textDimensions.x / 2;

    // Avoid distorted letters due to scaled parent
    label.scale.y /= aspectRatio;

    // Align text with component parent
    label.rotation.x = -(Math.PI / 2);
    label.rotation.z = -(Math.PI / 2);
  }
}