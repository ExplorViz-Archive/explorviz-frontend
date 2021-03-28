import THREE from 'three';
import VRController from '../vr-controller';

export function getCameraPose(camera: THREE.Camera) {
  const position = new THREE.Vector3();
  camera.getWorldPosition(position);

  return { position, quaternion: camera.quaternion };
}

export function getObjectPose(object: THREE.Object3D) {
  const position = new THREE.Vector3();
  object.getWorldPosition(position);

  // Use world quaternions because controller can also be rotated via controllerGroup
  const quaternion = new THREE.Quaternion();
  object.getWorldQuaternion(quaternion);

  return { position, quaternion };
}

export function getPoses(camera: THREE.Camera, controller1: VRController | undefined,
  controller2: VRController | undefined) {
  const cameraPose = getCameraPose(camera);

  let controller1Pose = { position: new THREE.Vector3(), quaternion: new THREE.Quaternion() };
  if (controller1) {
    controller1Pose = getObjectPose(controller1.raySpace);
  }

  let controller2Pose = { position: new THREE.Vector3(), quaternion: new THREE.Quaternion() };
  if (controller2) {
    controller2Pose = getObjectPose(controller2.raySpace);
  }

  return { camera: cameraPose, controller1: controller1Pose, controller2: controller2Pose };
}

export function measureText(text: string, {font, alignment, baseline}: {
  font: string,
  alignment: CanvasTextAlign,
  baseline: CanvasTextBaseline
}): TextMetrics {
  // re-use canvas object for better performance
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw `failed to measure text: ${text}`;

  ctx.font = font;
  ctx.textAlign = alignment;
  ctx.textBaseline = baseline;
  return ctx.measureText(text);
}

/**
 * Sets MeshStandardMaterial of given object to have the given opacity.
 * Displays object using wireframes (instead of polygons):
 */
export function displayAsWireframe(object: THREE.Object3D, frameLineWidth = 0.5, opacity = 0.1) {
  if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
    object.material.wireframe = true;
    object.material.wireframeLinewidth = frameLineWidth;

    if (opacity < 1) {
      object.material.transparent = true;
      object.material.opacity = opacity;
    }
  }

  object.children.forEach((child) => {
    displayAsWireframe(child);
  });
}

/**
 * Sets MeshStandardMaterial of given object to have the given opacity.
 * Displays object using polygons (instead of wireframe):
 */
export function displayAsSolidObject(object: THREE.Object3D, opacity = 1) {
  if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
    object.material.wireframe = false;

    object.material.transparent = opacity !== 1;
    object.material.opacity = opacity;
  }

  object.children.forEach((child) => {
    displayAsSolidObject(child);
  });
}
