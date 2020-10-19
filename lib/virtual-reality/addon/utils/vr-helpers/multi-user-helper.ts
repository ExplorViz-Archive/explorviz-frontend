import VRController from 'explorviz-frontend/utils/vr-rendering/VRController';
import {
  Camera, Object3D, Quaternion, Vector3,
} from 'three';

export function getCameraPose(camera: Camera) {
  const position = new Vector3();
  camera.getWorldPosition(position);
  // Add position with regard to headset movement

  return { position, quaternion: camera.quaternion };
}

export function getControllerPose(controller: Object3D) {
  const position = new Vector3();
  controller.getWorldPosition(position);

  // Use world quaternions because controller can also be rotated via controllerGroup
  const quaternion = new Quaternion();
  controller.getWorldQuaternion(quaternion);

  return { position, quaternion };
}

export function getPoses(camera: Camera, controller1: VRController|undefined,
  controller2: VRController|undefined) {
  const cameraPose = getCameraPose(camera);

  let controller1Pose = { position: new Vector3(), quaternion: new Quaternion() };
  if (controller1) {
    controller1Pose = getControllerPose(controller1.raySpace);
  }

  let controller2Pose = { position: new Vector3(), quaternion: new Quaternion() };
  if (controller2) {
    controller2Pose = getControllerPose(controller2.raySpace);
  }

  return { camera: cameraPose, controller1: controller1Pose, controller2: controller2Pose };
}
