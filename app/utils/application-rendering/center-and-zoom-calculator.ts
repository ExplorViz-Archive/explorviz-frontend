import THREE from 'three';

export default function calculateAppCenterAndZZoom(data: any) {
  const MIN_X = 0;
  const MAX_X = 1;
  const MIN_Y = 2;
  const MAX_Y = 3;
  const MIN_Z = 4;
  const MAX_Z = 5;

  const rect : number[] = [];
  rect.push(data.positionX);
  rect.push(data.positionY + data.width);
  rect.push(data.positionY);
  rect.push(data.positionY + data.height);
  rect.push(data.positionZ);
  rect.push(data.positionZ + data.depth);

  const viewCenterPoint = new THREE.Vector3(rect.get(MIN_X) + 
    ((rect.get(MAX_X) - rect.get(MIN_X)) / 2.0),
    rect.get(MIN_Y) + ((rect.get(MAX_Y) - rect.get(MIN_Y)) / 2.0),
    rect.get(MIN_Z) + ((rect.get(MAX_Z) - rect.get(MIN_Z)) / 2.0));

  return viewCenterPoint;
}
