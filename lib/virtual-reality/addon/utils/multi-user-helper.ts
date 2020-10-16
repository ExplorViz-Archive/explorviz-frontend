import VRController from 'explorviz-frontend/utils/VRController';
import {
  Camera, Matrix4, Object3D, Quaternion, Vector3,
} from 'three';

/**
 * Author: Martin John Baker
 * https://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/
 *
 * @param {Matrix} matrix rotation matrix
 */
export function getQuaternionFromMatrix(matrix: Matrix4) {
  let qx; let qy; let qz; let qw;

  // @ts-ignore
  // eslint-disable-next-line
  const [m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33] = matrix.elements;

  const tr = m00 + m11 + m22;

  if (tr > 0) {
    const s = Math.sqrt(tr + 1.0) * 2; // s=4*qw
    qw = 0.25 * s;
    qx = (m21 - m12) / s;
    qy = (m02 - m20) / s;
    qz = (m10 - m01) / s;
  } else if ((m00 > m11) && (m00 > m22)) {
    const s = Math.sqrt(1.0 + m00 - m11 - m22) * 2; // s=4*qx
    qw = (m21 - m12) / s;
    qx = 0.25 * s;
    qy = (m01 + m10) / s;
    qz = (m02 + m20) / s;
  } else if (m11 > m22) {
    const s = Math.sqrt(1.0 + m11 - m00 - m22) * 2; // s=4*qy
    qw = (m02 - m20) / s;
    qx = (m01 + m10) / s;
    qy = 0.25 * s;
    qz = (m12 + m21) / s;
  } else {
    const s = Math.sqrt(1.0 + m22 - m00 - m11) * 2; // s=4*qz
    qw = (m10 - m01) / s;
    qx = (m02 + m20) / s;
    qy = (m12 + m21) / s;
    qz = 0.25 * s;
  }

  return new Quaternion(qx, qy, qz, qw);
}

export function getCameraPose(camera: Camera) {
  // Copy rotation matrix status, because getWorldPosition changes the values
  const matrix = camera.matrixWorld.clone();

  const posCameraMatrix = new Vector3(
    matrix.elements[12],
    matrix.elements[13],
    matrix.elements[14],
  );

  const position = new Vector3();
  camera.getWorldPosition(position);
  // Add position with regard to headset movement
  position.add(posCameraMatrix);

  const quaternion = getQuaternionFromMatrix(matrix);

  return { position, quaternion };
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
