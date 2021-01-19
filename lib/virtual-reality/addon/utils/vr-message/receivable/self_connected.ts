import { Color, isColor } from "../util/color";

export const SELF_CONNECTED_EVENT = 'self_connected';

export type SelfConnectedMessage = {
    event: typeof SELF_CONNECTED_EVENT,
    self: { id: string, name: string, color: Color },
    users: {
        id: string, name: string, color: Color,
        controllers: { controller1: string, controller2: string }
    }[]
};

export function isSelfConnectedMessage(msg: any): msg is SelfConnectedMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === SELF_CONNECTED_EVENT
        && typeof msg.self === 'object'
        && typeof msg.self.id === 'string'
        && typeof msg.self.name === 'string'
        && isColor(msg.self.color)
        && Array.isArray(msg.users)
        && msg.users.every((user: any) =>
            typeof user === 'object'
            && typeof user.id === 'string'
            && typeof user.name === 'string'
            && isColor(user.color)
            && typeof user.controllers === 'object'
            && typeof user.controller1 === 'string'
            && typeof user.controller2 === 'string');
}