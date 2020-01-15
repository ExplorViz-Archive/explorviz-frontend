import THREE from 'three';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import CommunicationLayout from '../../layout-models/communication-layout';
import CommunicationMesh from '../communication-mesh';

export default class CommunicationSegmentMesh extends CommunicationMesh {

  constructor(layout: CommunicationLayout, dataModel: DrawableClazzCommunication,
    defaultColor: THREE.Color, highlightingColor: THREE.Color) {
    super(layout, dataModel, defaultColor, highlightingColor);
  }

  // Delegate highlighting to parent
  highlight(){
    if (this.parent instanceof CommunicationMesh){
      this.parent.highlight();
    }
  }

  // Delegate unhighlighting to parent
  unhighlight(){
    if (this.parent instanceof CommunicationMesh){
      this.parent.unhighlight();
    }
  }


  highlightSegment() {
    this.highlighted = true;
    if (this.material instanceof THREE.MeshBasicMaterial) {
      this.material.color = this.highlightingColor;
    }
  }


  unhighlightSegment() {
    this.highlighted = false;
    if (this.material instanceof THREE.MeshBasicMaterial) {
      this.material.color = this.defaultColor;
      this.material.transparent = false;
      this.material.opacity = 1.0;
    }
  }

  static computeCurveMeshes(layout: CommunicationLayout, dataModel: DrawableClazzCommunication, 
    defaultColor: THREE.Color, highlightingColor: THREE.Color, viewCenterPoint: THREE.Vector3, curveHeight: number){
    let start = layout.startPoint;
    let end = layout.endPoint;

    // Determine middle
    let dir = end.clone().sub(start);
    let len = dir.length();
    let halfVector = dir.normalize().multiplyScalar(len * 0.5);
    let middle = start.clone().add(halfVector);
    middle.y += curveHeight;

    let curve = new THREE.QuadraticBezierCurve3(
      start,
      middle,
      end
    );

    let curvePoints = curve.getPoints(40);
    let curveMeshes = [];

    // Compute meshes for curve
    for (let i = 0; i < curvePoints.length - 1; i++) {
      let curveSegment = new CommunicationSegmentMesh(layout, dataModel, defaultColor, highlightingColor);
      curveSegment.renderAsLine(viewCenterPoint, curvePoints[i], curvePoints[i + 1]);
      curveMeshes.push(curveSegment);
    }
    return curveMeshes;
  }

}