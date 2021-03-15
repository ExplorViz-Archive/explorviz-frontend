import { EventDispatcher } from "three";
import WebSocketService from "virtual-reality/services/web-socket";
import { ForwardedMessage, isForwardedMessage, isForwardedMessageOf } from "./receivable/forwarded";
import { InitialLandscapeMessage, isInitialLandscapeMessage } from "./receivable/landscape";
import { isMenuDetachedForwardMessage, MenuDetachedForwardMessage } from "./receivable/menu-detached-forward";
import { isResponseMessage, ResponseMessage } from "./receivable/response";
import { isSelfConnectedMessage, SelfConnectedMessage } from "./receivable/self_connected";
import { isUserConnectedMessage, UserConnectedMessage, } from "./receivable/user_connected";
import { isUserDisconnectedMessage, UserDisconnectedMessage } from "./receivable/user_disconnect";
import { AppClosedMessage, isAppClosedMessage } from "./sendable/request/app_closed";
import { AppOpenedMessage, isAppOpenedMessage } from "./sendable/app_opened";
import { ComponentUpdateMessage, isComponentUpdateMessage } from "./sendable/component_update";
import { DetachedMenuClosedMessage, isDetachedMenuClosedMessage } from "./sendable/request/detached_menu_closed";
import { HighlightingUpdateMessage, isHighlightingUpdateMessage } from "./sendable/highlighting_update";
import { isObjectMovedMessage, ObjectMovedMessage } from "./sendable/object_moved";
import { isSpectatingUpdateMessage, SpectatingUpdateMessage } from "./sendable/spectating_update";
import { isUserControllerMessage, UserControllerMessage } from "./sendable/user_controllers";
import { isUserPositionsMessage, UserPositionsMessage } from "./sendable/user_positions";
import { Nonce } from "./util/nonce";
import { isPingUpdateMessage, PingUpdateMessage } from "./sendable/ping-update";

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
    onMenuDetached(msg: MenuDetachedForwardMessage): void;

    // Forwarded messages.
    onUserPositions(msg: ForwardedMessage<UserPositionsMessage>): void;
    onUserControllers(msg: ForwardedMessage<UserControllerMessage>): void;
    onAppOpened(msg: ForwardedMessage<AppOpenedMessage>): void;
    onAppClosed(msg: ForwardedMessage<AppClosedMessage>): void;
    onDetachedMenuClosed(msg: ForwardedMessage<DetachedMenuClosedMessage>): void;
    onPingUpdate(msg:ForwardedMessage<PingUpdateMessage>):void;

    onObjectMoved(msg: ForwardedMessage<ObjectMovedMessage>): void;
    onComponentUpdate(msg: ForwardedMessage<ComponentUpdateMessage>): void;
    onHighlightingUpdate(msg: ForwardedMessage<HighlightingUpdateMessage>): void;
    onSpectatingUpdate(msg: ForwardedMessage<SpectatingUpdateMessage>): void;
}

export default class VrMessageReceiver extends EventDispatcher {
    private webSocket: WebSocketService;
    private messageListener: VrMessageListener;

    constructor(webSocket: WebSocketService, messageListener: VrMessageListener) {
        super();
        this.messageListener = messageListener;
        this.webSocket = webSocket;
        this.webSocket.messageCallback = this.onMessage.bind(this);
    }

    private onMessage(msg: any) {
        if (isForwardedMessage(msg)) return this.onForwardedMessage(msg);
        if (isResponseMessage(msg)) return this.onResponseMessage(msg);
        if (isSelfConnectedMessage(msg)) return this.messageListener.onSelfConnected(msg);
        if (isUserConnectedMessage(msg)) return this.messageListener.onUserConnected(msg);
        if (isUserDisconnectedMessage(msg)) return this.messageListener.onUserDisconnect(msg);
        if (isInitialLandscapeMessage(msg)) return this.messageListener.onInitialLandscape(msg);
        if (isMenuDetachedForwardMessage(msg)) return this.messageListener.onMenuDetached(msg);
        console.error('Received invalid message', msg);
    }

    private onForwardedMessage(msg: ForwardedMessage<any>) {
        if (isForwardedMessageOf(msg, isUserPositionsMessage)) return this.messageListener.onUserPositions(msg);
        if (isForwardedMessageOf(msg, isUserControllerMessage)) return this.messageListener.onUserControllers(msg);
        if (isForwardedMessageOf(msg, isAppOpenedMessage)) return this.messageListener.onAppOpened(msg);
        if (isForwardedMessageOf(msg, isAppClosedMessage)) return this.messageListener.onAppClosed(msg);
        if (isForwardedMessageOf(msg, isDetachedMenuClosedMessage)) return this.messageListener.onDetachedMenuClosed(msg);
        if (isForwardedMessageOf(msg, isObjectMovedMessage)) return this.messageListener.onObjectMoved(msg);
        if (isForwardedMessageOf(msg, isComponentUpdateMessage)) return this.messageListener.onComponentUpdate(msg);
        if (isForwardedMessageOf(msg, isHighlightingUpdateMessage)) return this.messageListener.onHighlightingUpdate(msg);
        if (isForwardedMessageOf(msg, isSpectatingUpdateMessage)) return this.messageListener.onSpectatingUpdate(msg);
        if (isForwardedMessageOf(msg, isPingUpdateMessage)) return this.messageListener.onPingUpdate(msg);
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
     * If the user is offline, no listener will be created.
     * 
     * @param nonce Locally unique identifier of the request whose response to wait for.
     * @param responseType A type guard that tests whether the received response has the correct type.
     * @param onResponse The callback to invoke when the response is received.
     * @param onOffline The callback to invoke before staring to listen for responses when the client is connected.
     * @param onOffline The callback to invoke instead of listening for responses when the client is not connected.
     */
    awaitResponse<T>({
        nonce, 
        responseType: isValidResponse,
        onResponse,
        onOnline,
        onOffline
    }: {
        nonce: Nonce,
        responseType: (msg: any) => msg is T,
        onResponse: ResponseHandler<T>,
        onOnline?: () => void,
        onOffline?: () => void,
    }) {
        // Don't wait for response unless there is a open websocket connection.
        if (!this.webSocket.isWebSocketOpen()) {
            if (onOffline) onOffline();
            return;
        }

        // If a websocket connection is open, notify callee that the listener is added.
        if (onOnline) onOnline();

        // Listen for responses.
        const listener = (evt : ResponseEvent<any>) => {
            // Test whether the response belongs to the request with the given nonce.
            if (nonce === evt.nonce) {
                if (isValidResponse(evt.response)) {
                    this.removeEventListener('response', listener);
                    onResponse(evt.response);
                } else {
                    console.error('Received invalid response', evt.response);
                }
            }
        };
        this.addEventListener('response', listener);
    }
}