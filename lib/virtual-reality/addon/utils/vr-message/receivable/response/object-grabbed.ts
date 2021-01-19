const OBJECT_GRABBED_RESPONSE_EVENT = 'object_grabbed';

export type ObjectGrabbedResponse = {
    event: typeof OBJECT_GRABBED_RESPONSE_EVENT,
    success: boolean
};

export function isObjectGrabbedResponse(msg: any): msg is ObjectGrabbedResponse {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === OBJECT_GRABBED_RESPONSE_EVENT
        && typeof msg.success === 'boolean';
}