import { isPosition, Position } from "../util/position";
import { isQuaternion, Quaternion } from "../util/quaternion";

export const USER_POSITIONS_EVENT = 'user_positions';

type Pose = { position: Position, quaternion: Quaternion };
type ControllerPose = { position: Position, quaternion: Quaternion, intersection: Position | null}

export type UserPositionsMessage = {
    event: typeof USER_POSITIONS_EVENT,
    camera: Pose,
    controller1: ControllerPose,
    controller2: ControllerPose,
};

function isPose(pose: any): pose is Pose {
    return pose !== null
      && typeof pose === 'object'
      && isPosition(pose.position)
      && isQuaternion(pose.quaternion);
}

function isControllerPose(pose: any): pose is ControllerPose {
    return pose !== null
      && typeof pose === 'object'
      && isPosition(pose.position)
      && isQuaternion(pose.quaternion)
      && (isPosition(pose.intersection) || pose.intersection == null);
}

export function isUserPositionsMessage(msg: any): msg is UserPositionsMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === USER_POSITIONS_EVENT
        && isPose(msg.camera)
        && isControllerPose(msg.controller1)
        && isControllerPose(msg.controller2)
}
