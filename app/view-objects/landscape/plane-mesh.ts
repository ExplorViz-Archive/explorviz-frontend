import THREE from 'three';
import BaseMesh from '../3d/base-mesh';
import PlaneLayout from '../layout-models/plane-layout';


export default abstract class PlaneMesh extends BaseMesh {

  layout: PlaneLayout;

  constructor(defaultColor: THREE.Color, highlightingColor: THREE.Color, layout: PlaneLayout) {
    super(defaultColor, highlightingColor);
    this.layout = layout;
  }

  abstract createLabel(font: THREE.Font, color: THREE.Color): void

}