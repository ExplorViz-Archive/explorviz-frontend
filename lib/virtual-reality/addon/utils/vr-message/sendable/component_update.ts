export const COMPONENT_UPDATE_EVENT = 'component_update';

export type ComponentUpdateMessage = {
    event: typeof COMPONENT_UPDATE_EVENT,
    isFoundation: boolean,
    appID: string,
    componentID: string
};

export function isComponentUpdateMessage(msg: any): msg is ComponentUpdateMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === COMPONENT_UPDATE_EVENT
        && typeof msg.isFoundation === 'boolean'
        && typeof msg.appID === 'string'
        && typeof msg.componentID === 'string';
}