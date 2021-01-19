export const HIGHLIGHTING_UPDATE_EVENT = 'hightlighting_update';

export type HighlightingUpdateMessage = {
    event: typeof HIGHLIGHTING_UPDATE_EVENT,
    isHighlighted: boolean,
    appID: string,
    entityType: string,
    entityID: string
};

export function isHighlightingUpdateMessage(msg: any): msg is HighlightingUpdateMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === HIGHLIGHTING_UPDATE_EVENT
        && typeof msg.appID === 'string'
        && typeof msg.entityType === 'string'
        && typeof msg.entityID === 'string';
}