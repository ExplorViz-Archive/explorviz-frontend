import THREE from 'three';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import CommunicationLayout from '../layout-models/communication-layout';


export default class CommunicationMesh extends THREE.Mesh {

  dataModel: DrawableClazzCommunication;
  layout: CommunicationLayout;

  highlighted: boolean = false;
  defaultColor: THREE.Color;
  highlightingColor: THREE.Color;

  constructor(layout: CommunicationLayout, dataModel: DrawableClazzCommunication, 
    defaultColor: THREE.Color, highlightingColor: THREE.Color) {
    super();
    this.layout = layout;
    this.dataModel = dataModel;
    this.defaultColor = defaultColor;
    this.highlightingColor = highlightingColor;

    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(defaultColor)
    });
  }

  highlight() {
    this.highlighted = true;
    if (this.material instanceof THREE.MeshBasicMaterial) {
      this.material.color = this.highlightingColor;
    }
  }

  unhighlight() {
    this.highlighted = false;
    if (this.material instanceof THREE.MeshBasicMaterial) {
      this.material.color = this.defaultColor;
      this.material.transparent = false;
      this.material.opacity = 1.0;
    }
  }
}