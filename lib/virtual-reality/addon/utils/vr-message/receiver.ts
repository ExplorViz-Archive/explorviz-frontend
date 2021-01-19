import { EventDispatcher } from "three";
import WebSocketService from "virtual-reality/services/web-socket";
import { ForwardedMessage, isForwardedMessage, isForwardedMessageOf } from "./receivable/forwarded";
import { InitialLandscapeMessage, isInitialLandscapeMessage } from "./receivable/landscape";
import { isResponseMessage, ResponseMessage } from "./receivable/response";
import { isSelfConnectedMessage, SelfConnectedMessage } from "./receivable/self_connected";
import { isUserConnectedMessage, UserConnectedMessage, } from "./receivable/user_connected";
import { isUserDisconnectedMessage, UserDisconnectedMessage } from "./receivable/user_disconnect";
import { AppClosedMessage, isAppClosedMessage } from "./sendable/app_closed";
import { AppOpenedMessage, isAppOpenedMessage } from "./sendable/app_opened";
import { ComponentUpdateMessage, isComponentUpdateMessage } from "./sendable/component_update";
import { HighlightingUpdateMessage, isHighlightingUpdateMessage } from "./sendable/highlighting_update";
import { isObjectMovedMessage, ObjectMovedMessage } from "./sendable/object_moved";
import { isSpectatingUpdateMessage, SpectatingUpdateMessage } from "./sendable/spectating_update";
import { isUserControllerMessage, UserControllerMessage } from "./sendable/user_controllers";
import { isUserPositionsMessage, UserPositionsMessage } from "./sendable/user_positions";

const RESPONSE_EVENT = 'response';
type ResponseEvent<T> = {
    type: typeof RESPONSE_EVENT, 
    nonce: number, 
    response: T
};
type ResponseHandler<T> = (msg: T) => void;

export interface VrMessageListener {
    onSelfConnected(msg: SelfConnectedMessage): void;
    onUserConnected(msg: UserConnectedMessage): void;
    onUserDisconnect(msg: UserDisconnectedMessage): void;
    onInitialLandscape(msg: InitialLandscapeMessage): void;

    // Forwarded messages.
    onUserPositions(msg: ForwardedMessage<UserPositionsMessage>): void;
    onUserControllers(msg: ForwardedMessage<UserControllerMessage>): void;
    onAppOpened(msg: ForwardedMessage<AppOpenedMessage>): void;
    onAppClosed(msg: ForwardedMessage<AppClosedMessage>): void;
    onObjectMoved(msg: ForwardedMessage<ObjectMovedMessage>): void;
    onComponentUpdate(msg: ForwardedMessage<ComponentUpdateMessage>): void;
    onHighlightingUpdate(msg: ForwardedMessage<HighlightingUpdateMessage>): void;
    onSpectatingUpdate(msg: ForwardedMessage<SpectatingUpdateMessage>): void;
}

export default class VrMessageReceiver extends EventDispatcher {
    private messageListener: VrMessageListener;

    constructor(webSocket: WebSocketService, messageListener: VrMessageListener) {
        super();
        this.messageListener = messageListener;
        webSocket.eventCallback = this.onMessage.bind(this);
    }

    private onMessage(msg: any) {
        if (isForwardedMessage(msg)) return this.onForwardedMessage(msg);
        if (isResponseMessage(msg)) return this.onResponseMessage(msg);
        if (isSelfConnectedMessage(msg)) return this.messageListener.onSelfConnected(msg);
        if (isUserConnectedMessage(msg)) return this.messageListener.onUserConnected(msg);
        if (isUserDisconnectedMessage(msg)) return this.messageListener.onUserDisconnect(msg);
        if (isInitialLandscapeMessage(msg)) return this.messageListener.onInitialLandscape(msg);
        console.error('Received invalid message', msg);
    }

    private onForwardedMessage(msg: ForwardedMessage<any>) {
        if (isForwardedMessageOf(msg, isUserPositionsMessage)) return this.messageListener.onUserPositions(msg);
        if (isForwardedMessageOf(msg, isUserControllerMessage)) return this.messageListener.onUserControllers(msg);
        if (isForwardedMessageOf(msg, isAppOpenedMessage)) return this.messageListener.onAppOpened(msg);
        if (isForwardedMessageOf(msg, isAppClosedMessage)) return this.messageListener.onAppClosed(msg);
        if (isForwardedMessageOf(msg, isObjectMovedMessage)) return this.messageListener.onObjectMoved(msg);
        if (isForwardedMessageOf(msg, isComponentUpdateMessage)) return this.messageListener.onComponentUpdate(msg);
        if (isForwardedMessageOf(msg, isHighlightingUpdateMessage)) return this.messageListener.onHighlightingUpdate(msg);
        if (isForwardedMessageOf(msg, isSpectatingUpdateMessage)) return this.messageListener.onSpectatingUpdate(msg);
        console.error('Received invalid forwarded message', msg);
    }

    private onResponseMessage(msg: ResponseMessage<any>) {
        this.dispatchEvent({
            type: 'response',
            nonce: msg.nonce,
            response: msg.response
        });
    }

    /**
     * Adds an event listener that is invoked when a response with the given
     * identifier is received.
     * 
     * When the response is received, the listener is removed.
     * 
     * @param nonce Locally unique identifier of the request whose response to wait for.
     * @param callback The callback to invoke when the response is received.
     */
    awaitResponse<T>(isValidResponse: (msg: T) => msg is T, nonce: number, callback: ResponseHandler<T>) {
        const listener = (evt : ResponseEvent<T>) => {
            if (nonce === evt.nonce) {
                if (isValidResponse(evt.response)) {
                    this.removeEventListener('response', listener);
                    callback(evt.response);
                } else {
                    console.error('Received invalid response', evt.response);
                }
            }
        };
        this.addEventListener('response', listener);
    }
}