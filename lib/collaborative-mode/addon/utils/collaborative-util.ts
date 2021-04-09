import THREE from "three";

export default function adjustForObjectRotation(vector: number[], quaternion: THREE.Quaternion) {
  const vec = new THREE.Vector3();
  vec.fromArray(vector);
  return vec.applyQuaternion(quaternion);
}
