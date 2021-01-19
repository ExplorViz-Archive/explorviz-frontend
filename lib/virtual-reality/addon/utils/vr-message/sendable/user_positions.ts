import { Position, isPosition } from "../util/position";
import { Quaternion, isQuaternion } from "../util/quaternion";

export const USER_POSITIONS_EVENT = 'user_positions';

type Pose = { position: Position, quaternion: Quaternion };

export type UserPositionsMessage = {
    event: typeof USER_POSITIONS_EVENT,
    camera: Pose,
    controller1: Pose,
    controller2: Pose
};

function isPose(pose: any): pose is Pose {
    return pose !== null 
      && typeof pose === 'object'
      && isPosition(pose.position)
      && isQuaternion(pose.quaternion);
}

export function isUserPositionsMessage(msg: any): msg is UserPositionsMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === USER_POSITIONS_EVENT
        && isPose(msg.camera)
        && isPose(msg.controller1)
        && isPose(msg.controller2);
}