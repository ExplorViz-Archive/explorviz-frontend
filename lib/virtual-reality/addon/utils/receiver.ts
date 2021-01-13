import { EventDispatcher } from "three";
import WebSocketService from "virtual-reality/services/web-socket";

type ResponseEvent = {type: string, nonce: number, data: any};
type ResponseHandler = (data: any) => void;

export interface MessageListener {
    onSelfConnected(
        self: {id: string, name: string, color: number[]}, 
        users: {id:string, name: string, color: number[], 
        controllers: {controller1: string, controller2: string}}[]
    ): void;
    onUserConnected(
        id: string,
        name: string,
        color: number[]
    ): void;
    onUserDisconnect(
        id: string
    ): void;
    onInitialLandscape(
        openApps: {
            id: string, 
            position: number[], 
            quaternion: number[], 
            openComponents: string[], 
            highlightedComponents: {
                userID: string, 
                appID: string, 
                entityType: string, 
                entityID: string, 
                isHighlighted: boolean}[]
            }[],
        landscape: {
            position: number[], 
            quaternion: number[]
        }
    ): void;

    // Forwarded messages.
    onUserPositions(
        userID: string, 
        camera: { position: number[], quaternion: number[] },
        controller1: { position: number[], quaternion: number[] },
        controller2: { position: number[], quaternion: number[] }
    ): void;
    onUserControllers(
        userID: string,
        connect: { controller1: string, controller2: string },
        disconnect: { controller1: string, controller2: string }
    ): void;
    onAppOpened(
        id: string, 
        position: number[], 
        quaternion: number[]
    ): void;
    onAppClosed(
        id: string
    ): void;
    onObjectMoved(
        objectId: string,
        position: number[],
        quaternion: number[]
    ): void;
    onComponentUpdate(
        isFoundation: boolean,
        appID: string,
        componentID: string
    ): void;
    onHighlightingUpdate(
        userID: string,
        isHighlighted: boolean,
        appID: string,
        entityType: string,
        entityID: string
    ): void;
    onSpectatingUpdate(
        userID: string, 
        isSpectating: boolean
    ): void;
}

export default class Receiver extends EventDispatcher {
    private messageListener: MessageListener;

    constructor(webSocket: WebSocketService, messageListener: MessageListener) {
        super();
        this.messageListener = messageListener;
        webSocket.eventCallback = this.onEvent.bind(this);
    }

    private onEvent(event: string, data: any) {
      switch (event) {
        case 'forward':
          this.onForwardEvent(data);
          break;
        case 'response':
          this.onResponseEvent(data);
          break;
        case 'self_connected':
          this.messageListener.onSelfConnected(data.self, data.users);
          break;
        case 'user_connected':
          this.messageListener.onUserConnected(data.id, data.name, data.color);
          break;
        case 'user_disconnect':
          this.messageListener.onUserDisconnect(data.id);
          break;
        case 'landscape':
          this.messageListener.onInitialLandscape(data.openApps, data.landscape);
          break;
        default:
          break;
      }
    }

    private onForwardEvent(data: any) {
        const message = data.originalMessage;
        const userID = data.userID;
        switch (message.event) {
        case 'user_positions':
            this.messageListener.onUserPositions(userID, message.camera, message.controller1, message.controller2);
            break;
        case 'user_controllers':
            this.messageListener.onUserControllers(userID, message.connect, message.disconnect);
            break;
        case 'app_opened':
            this.messageListener.onAppOpened(message.id, message.position, message.quaternion);
            break;
        case 'app_closed':
            this.messageListener.onAppClosed(message.appID);
            break;
        case 'object_moved':
            this.messageListener.onObjectMoved(message.appId, message.position, message.quaternion);
            break;
        case 'component_update':
            this.messageListener.onComponentUpdate(message.isFoundation, message.appID, message.componentID);
            break;
        case 'hightlighting_update':
            this.messageListener.onHighlightingUpdate(userID, message.isHighlighted, message.appID, message.entityType, message.entityID);
            break;
        case 'spectating_update':
            this.messageListener.onSpectatingUpdate(userID, message.isSpectating);
            break;
        }
    }

    private onResponseEvent(data: any) {
        this.dispatchEvent({
            type: 'response',
            nonce: data.nonce,
            data: data
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
    awaitResponse(nonce: number, callback: ResponseHandler) {
        const listener = ({nonce: responseNonce, data} : ResponseEvent) => {
            if (nonce == responseNonce) {
                this.removeEventListener('response', listener);
                callback(data);
            }
        };
        this.addEventListener('response', listener);
    }
}