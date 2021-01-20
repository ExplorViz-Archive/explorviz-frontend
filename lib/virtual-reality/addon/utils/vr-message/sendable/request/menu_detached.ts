import { isPosition, Position } from "../../util/position";
import { isQuaternion, Quaternion } from "../../util/quaternion";

export const MENU_DETACHED_EVENT = 'menu_detached';

export type MenuDetachedMessage = {
    event: typeof MENU_DETACHED_EVENT,
    nonce: number,
    detachId: string,
    position: Position,
    quaternion: Quaternion,
};

export function isMenuDetachedMessage(msg: any): msg is MenuDetachedMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === MENU_DETACHED_EVENT
        && typeof msg.nonce === 'number'
        && typeof msg.detachId === 'string'
        && isPosition(msg.position)
        && isQuaternion(msg.quaternion);
}