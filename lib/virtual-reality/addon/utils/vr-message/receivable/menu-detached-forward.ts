import { EntityType, isEntityType } from "../util/entity_type";
import { isPosition } from "../util/position";
import { isQuaternion } from "../util/quaternion";

export const MENU_DETACHED_FORWARD_EVENT = 'menu_detached';

export type MenuDetachedForwardMessage = {
    event: typeof MENU_DETACHED_FORWARD_EVENT,
    objectId: string,
    entityType: EntityType
    detachId: string,
    position: number[],
    quaternion:number[]
};

export function isMenuDetachedForwardMessage(msg: any): msg is MenuDetachedForwardMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === MENU_DETACHED_FORWARD_EVENT
        && typeof msg.objectId === 'string'
        && isEntityType(msg.entityType)
        && typeof msg.detachId === 'string'
        && isPosition(msg.position)
        && isQuaternion(msg.quaternion);
}