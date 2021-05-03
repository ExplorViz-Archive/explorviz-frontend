import Service, { inject as service } from '@ember/service';
import debugLogger from 'ember-debug-logger';
import WebSocketService from 'virtual-reality/services/web-socket';
import { isPingUpdateMessage, PingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/ping_update';
import { isTimestampUpdateMessage, TimestampUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/timetsamp_update';
import { ForwardedMessage, isForwardedMessage, isForwardedMessageOf } from '../utils/vr-message/receivable/forwarded';
import { InitialLandscapeMessage, isInitialLandscapeMessage } from '../utils/vr-message/receivable/landscape';
import { isMenuDetachedForwardMessage, MenuDetachedForwardMessage } from '../utils/vr-message/receivable/menu-detached-forward';
import { isResponseMessage, ResponseMessage } from '../utils/vr-message/receivable/response';
import { isSelfConnectedMessage, SelfConnectedMessage } from '../utils/vr-message/receivable/self_connected';
import { isUserConnectedMessage, UserConnectedMessage } from '../utils/vr-message/receivable/user_connected';
import { isUserDisconnectedMessage, UserDisconnectedMessage } from '../utils/vr-message/receivable/user_disconnect';
import { AppOpenedMessage, isAppOpenedMessage } from '../utils/vr-message/sendable/app_opened';
import { ComponentUpdateMessage, isComponentUpdateMessage } from '../utils/vr-message/sendable/component_update';
import { HighlightingUpdateMessage, isHighlightingUpdateMessage } from '../utils/vr-message/sendable/highlighting_update';
import { isObjectMovedMessage, ObjectMovedMessage } from '../utils/vr-message/sendable/object_moved';
import { AppClosedMessage, isAppClosedMessage } from '../utils/vr-message/sendable/request/app_closed';
import { DetachedMenuClosedMessage, isDetachedMenuClosedMessage } from '../utils/vr-message/sendable/request/detached_menu_closed';
import { isSpectatingUpdateMessage, SpectatingUpdateMessage } from '../utils/vr-message/sendable/spectating_update';
import { isUserControllerConnectMessage, UserControllerConnectMessage } from '../utils/vr-message/sendable/user_controller_connect';
import { isUserControllerDisconnectMessage, UserControllerDisconnectMessage } from '../utils/vr-message/sendable/user_controller_disconnect';
import { isUserPositionsMessage, UserPositionsMessage } from '../utils/vr-message/sendable/user_positions';
import { Nonce } from '../utils/vr-message/util/nonce';

type ResponseHandler<T> = (msg: T) => void;

export interface VrMessageListener {
  onSelfConnected(msg: SelfConnectedMessage): void;
  onUserConnected(msg: UserConnectedMessage): void;
  onUserDisconnect(msg: UserDisconnectedMessage): void;
  onInitialLandscape(msg: InitialLandscapeMessage): void;
  onMenuDetached(msg: MenuDetachedForwardMessage): void;

  // Forwarded messages.
  onUserPositions(msg: ForwardedMessage<UserPositionsMessage>): void;
  onUserControllerConnect(
    msg: ForwardedMessage<UserControllerConnectMessage>
  ): void;
  onUserControllerDisconnect(
    msg: ForwardedMessage<UserControllerDisconnectMessage>
  ): void;
  onAppOpened(msg: ForwardedMessage<AppOpenedMessage>): void;
  onAppClosed(msg: ForwardedMessage<AppClosedMessage>): void;
  onDetachedMenuClosed(msg: ForwardedMessage<DetachedMenuClosedMessage>): void;
  onPingUpdate(msg: ForwardedMessage<PingUpdateMessage>): void;
  onTimestampUpdate(msg: ForwardedMessage<TimestampUpdateMessage>): void;
  onObjectMoved(msg: ForwardedMessage<ObjectMovedMessage>): void;
  onComponentUpdate(msg: ForwardedMessage<ComponentUpdateMessage>): void;
  onHighlightingUpdate(msg: ForwardedMessage<HighlightingUpdateMessage>): void;
  onSpectatingUpdate(msg: ForwardedMessage<SpectatingUpdateMessage>): void;
}

export default class VrMessageReceiver extends Service {
  private debug = debugLogger('VrMessageReceiver');

  @service('web-socket')
  private webSocket!: WebSocketService;

  private messageListeners: VrMessageListener[] = [];

  private responseHandlers = new Map<Nonce, ResponseHandler<any>>();

  init() {
    super.init();
    this.webSocket.messageCallback = (msg) => this.onMessage(msg);
  }

  /**
   * Registers a new listener whose message handler methods should be invoked
   * whenever a message is received.
   *
   * @param messageListener The new message listener.
   */
  addMessageListener(messageListener: VrMessageListener) {
    this.messageListeners.push(messageListener);
  }

  /**
   * Removes a listener from the list of messages that are notified when
   * messages are received from the backend.
   *
   * @param messageListener The listener to remove.
   */
  removeMessageListener(messageListener: VrMessageListener) {
    const index = this.messageListeners.indexOf(messageListener);
    this.messageListeners.splice(index, 1);
  }

  private onMessage(msg: any) {
    if (isForwardedMessage(msg)) {
      this.onForwardedMessage(msg);
      return;
    }
    if (isResponseMessage(msg)) {
      this.onResponseMessage(msg);
      return;
    }
    if (isSelfConnectedMessage(msg)) {
      this.messageListeners.forEach((l) => l.onSelfConnected(msg));
      return;
    }
    if (isUserConnectedMessage(msg)) {
      this.messageListeners.forEach((l) => l.onUserConnected(msg));
      return;
    }
    if (isUserDisconnectedMessage(msg)) {
      this.messageListeners.forEach((l) => l.onUserDisconnect(msg));
      return;
    }
    if (isInitialLandscapeMessage(msg)) {
      this.messageListeners.forEach((l) => l.onInitialLandscape(msg));
      return;
    }
    if (isMenuDetachedForwardMessage(msg)) {
      this.messageListeners.forEach((l) => l.onMenuDetached(msg));
      return;
    }
    this.debug('Received invalid message', msg);
  }

  private onForwardedMessage(msg: ForwardedMessage<any>) {
    if (isForwardedMessageOf(msg, isUserPositionsMessage)) {
      this.messageListeners.forEach((l) => l.onUserPositions(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isUserControllerConnectMessage)) {
      this.messageListeners.forEach((l) => l.onUserControllerConnect(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isUserControllerDisconnectMessage)) {
      this.messageListeners.forEach((l) => l.onUserControllerDisconnect(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isAppOpenedMessage)) {
      this.messageListeners.forEach((l) => l.onAppOpened(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isAppClosedMessage)) {
      this.messageListeners.forEach((l) => l.onAppClosed(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isDetachedMenuClosedMessage)) {
      this.messageListeners.forEach((l) => l.onDetachedMenuClosed(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isObjectMovedMessage)) {
      this.messageListeners.forEach((l) => l.onObjectMoved(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isComponentUpdateMessage)) {
      this.messageListeners.forEach((l) => l.onComponentUpdate(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isHighlightingUpdateMessage)) {
      this.messageListeners.forEach((l) => l.onHighlightingUpdate(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isSpectatingUpdateMessage)) {
      this.messageListeners.forEach((l) => l.onSpectatingUpdate(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isPingUpdateMessage)) {
      this.messageListeners.forEach((l) => l.onPingUpdate(msg));
      return;
    }
    if (isForwardedMessageOf(msg, isTimestampUpdateMessage)) {
      this.messageListeners.forEach((l) => l.onTimestampUpdate(msg));
      return;
    }
    this.debug('Received invalid forwarded message', msg);
  }

  private onResponseMessage(msg: ResponseMessage<any>) {
    const handler = this.responseHandlers.get(msg.nonce);
    if (handler) handler(msg.response);
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
   * @param onOnline The callback to invoke before staring to listen for responses when the client
   * is connected.
   * @param onOffline The callback to invoke instead of listening for responses when the client is
   * not connected.
   */
  awaitResponse<T>({
    nonce,
    responseType: isValidResponse,
    onResponse,
    onOnline,
    onOffline,
  }: {
    nonce: Nonce;
    responseType: (msg: any) => msg is T;
    onResponse: ResponseHandler<T>;
    onOnline?: () => void;
    onOffline?: () => void;
  }) {
    // Don't wait for response unless there is a open websocket connection.
    if (!this.webSocket.isWebSocketOpen()) {
      if (onOffline) onOffline();
      return;
    }

    // If a websocket connection is open, notify callee that the listener is added.
    if (onOnline) onOnline();

    // Listen for responses.
    const handler = (response: any) => {
      if (isValidResponse(response)) {
        this.responseHandlers.delete(nonce);
        onResponse(response);
      } else {
        this.debug('Received invalid response', response);
      }
    };
    this.responseHandlers.set(nonce, handler);
  }
}

declare module '@ember/service' {
  interface Registry {
    'vr-message-receiver': VrMessageReceiver;
  }
}
