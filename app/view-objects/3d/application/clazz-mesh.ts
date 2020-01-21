import THREE from 'three';
import BoxMesh from './box-mesh';
import Clazz from 'explorviz-frontend/models/clazz';
import ClazzLabelMesh from './clazz-label-mesh';

export default class ClazzMesh extends BoxMesh {

  geometry: THREE.BoxGeometry;
  material: THREE.MeshLambertMaterial;
  dataModel: Clazz;


  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    clazz: Clazz, defaultColor: THREE.Color, highlightingColor: THREE.Color) {

    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    let material = new THREE.MeshLambertMaterial({ color: defaultColor });
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = clazz;
  }

  createLabel(font: THREE.Font, color: THREE.Color){
    let label = new ClazzLabelMesh(font, this.dataModel.name, color);
    
    this.positionLabel(label);
    this.add(label);
  }

  positionLabel(label: ClazzLabelMesh){
    // Set label origin to center of clazz mesh
    label.geometry.center();
    // Set y-position just above the clazz mesh
    label.position.y = this.geometry.parameters.height / 2 + 0.01;

    // Rotate text
    label.rotation.x = -(Math.PI / 2);
    label.rotation.z = -(Math.PI / 3);
  }
}