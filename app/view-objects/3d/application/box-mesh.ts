import THREE from 'three';
import BaseMesh from '../base-mesh';


export default abstract class BoxMesh extends BaseMesh {

  layoutPos: THREE.Vector3;

  layoutHeight: number;
  layoutWidth: number;
  layoutdDepth: number;


  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    defaultColor: THREE.Color, highlightingColor: THREE.Color) {
    super(defaultColor, highlightingColor);

    this.layoutPos = layoutPos;

    this.layoutHeight = layoutHeight;
    this.layoutWidth = layoutWidth;
    this.layoutdDepth = layoutDepth;

    // Set default position to layout data
    this.position.copy(layoutPos);

    // Set default dimensions to layout data
    this.height = layoutHeight;
    this.width = layoutWidth;
    this.depth = layoutDepth;
  }

  get width() {
    return this.scale.x;
  }

  set width(width: number) {
    this.scale.x = width;
  }

  get height() {
    return this.scale.y;
  }

  set height(height: number) {
    this.scale.y = height;
  }

  get depth() {
    return this.scale.z;
  }

  set depth(depth: number) {
    this.scale.z = depth;
  }

  abstract createLabel(font: THREE.Font): void

}