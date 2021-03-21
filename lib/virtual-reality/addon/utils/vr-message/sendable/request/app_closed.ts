import { isNonce, Nonce } from "../../util/nonce";

export const APP_CLOSED_EVENT = 'app_closed';

export type AppClosedMessage = {
  event: typeof APP_CLOSED_EVENT,
  nonce: Nonce,
  appID: string
};

export function isAppClosedMessage(msg: any): msg is AppClosedMessage {
  return msg !== null
    && typeof msg === 'object'
    && msg.event === APP_CLOSED_EVENT
    && isNonce(msg.nonce)
    && typeof msg.appID === 'string';
}
