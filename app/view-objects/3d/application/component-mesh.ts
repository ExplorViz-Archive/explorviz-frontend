import THREE from 'three';
import Component from 'explorviz-frontend/models/component';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import BoxMesh from './box-mesh';
import ComponentLabelMesh from './component-label-mesh';

export default class ComponentMesh extends BoxMesh {
  geometry: THREE.BoxGeometry;

  material: THREE.MeshLambertMaterial;

  dataModel: Component;

  opened: boolean = false;

  // Set by labeler
  labelMesh: ComponentLabelMesh | null = null;

  constructor(layout: BoxLayout, component: Component, defaultColor: THREE.Color,
    highlightingColor: THREE.Color) {
    super(layout, defaultColor, highlightingColor);

    const material = new THREE.MeshLambertMaterial({ color: defaultColor });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = component;
  }
}
