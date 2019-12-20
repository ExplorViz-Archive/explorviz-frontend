import THREE from 'three';
import DrawNodeEntity from 'explorviz-frontend/models/drawnodeentity';


export function createPlane(model: DrawNodeEntity, color: THREE.Color) {
  const material = new THREE.MeshBasicMaterial({
    color
  });

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(model.get('width'),
    model.get('height')), material);

  plane.userData['model'] = model;
  return plane;
}