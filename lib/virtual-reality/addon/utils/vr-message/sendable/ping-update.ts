export const PING_UPDATE_EVENT = 'ping_update';

export type PingUpdateMessage = {
    event: typeof PING_UPDATE_EVENT,
    controllerId: number,
    isPinging: boolean
};

export function isPingUpdateMessage(msg: any): msg is PingUpdateMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === PING_UPDATE_EVENT
        && typeof msg.controllerId === 'number'
        && typeof msg.isPinging === 'boolean'
}
