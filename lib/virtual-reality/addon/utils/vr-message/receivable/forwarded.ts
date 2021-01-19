export const FORWARDED_EVENT = 'forward';

export type ForwardedMessage<T> = {
    event: typeof FORWARDED_EVENT,
    userID: string,
    originalMessage: T
};

export function isForwardedMessage(msg: any): msg is ForwardedMessage<any> {
    return msg !== null 
        && typeof msg === 'object'
        && msg.event === FORWARDED_EVENT
        && typeof msg.userID === 'string';
}

export function isForwardedMessageOf<T>(msg: any, isT: (x: any) => x is T): msg is ForwardedMessage<any> {
    return isForwardedMessage(msg)
        && isT(msg.originalMessage);
}