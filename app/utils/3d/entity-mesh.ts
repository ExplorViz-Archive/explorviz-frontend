import THREE from 'three';


export default abstract class EntityMesh extends THREE.Mesh {

  layoutPos: THREE.Vector3;

  layoutHeight: number;
  layoutWidth: number;
  layoutdDepth: number;

  highlighted: boolean = false;
  defaultColor: THREE.Color;
  highlightingColor: THREE.Color;


  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    defaultColor: THREE.Color, highlightingColor: THREE.Color) {
    super();

    this.layoutPos = layoutPos;

    this.layoutHeight = layoutHeight;
    this.layoutWidth = layoutWidth;
    this.layoutdDepth = layoutDepth;

    // Set default position to layout data
    this.position.copy(layoutPos);

    // Set default dimensions to layout data
    this.height = layoutHeight;
    this.width = layoutWidth / 2;
    this.depth = layoutDepth / 2;

    this.defaultColor = defaultColor;
    this.highlightingColor = highlightingColor;
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


  highlight() {
    this.highlighted = true;
    if (this.material instanceof THREE.MeshLambertMaterial) {
      this.material.color = this.highlightingColor;
    }
  }

  unhighlight() {
    this.highlighted = false;
    if (this.material instanceof THREE.MeshLambertMaterial) {
      this.material.color = this.defaultColor;
      this.material.transparent = false;
      this.material.opacity = 1.0;
    }
  }

}