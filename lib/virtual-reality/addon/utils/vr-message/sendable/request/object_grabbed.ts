export const OBJECT_GRABBED_EVENT = 'object_grabbed';

export type ObjectGrabbedMessage = {
    event: typeof OBJECT_GRABBED_EVENT,
    nonce: number,
    objectId: string,
};

export function isObjectGrabbedMessage(msg: any): msg is ObjectGrabbedMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === OBJECT_GRABBED_EVENT
        && typeof msg.nonce === 'number'
        && typeof msg.objectId === 'string';
}