import { Position, isPosition } from "../util/position";
import { isQuaternion, Quaternion } from "../util/quaternion";

export const OBJECT_MOVED_EVENT = 'object_moved';

export type ObjectMovedMessage = {
    event: typeof OBJECT_MOVED_EVENT,
    objectId: string,
    position: Position,
    quaternion: Quaternion
};

export function isObjectMovedMessage(msg: any): msg is ObjectMovedMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === OBJECT_MOVED_EVENT
        && typeof msg.objectId === 'string'
        && isPosition(msg.position)
        && isQuaternion(msg.quaternion);
}