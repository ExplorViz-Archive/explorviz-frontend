import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import ENV from 'explorviz-frontend/config/environment';

const { collaborationService, collaborationSocketPath } = ENV.backendAddresses;

export default class WebSocketService extends Service.extend(Evented) {
  @service()
  private websockets!: any;

  private debug = debugLogger('WebSocketService');

  private currentSocket: any = null; // WebSocket to send/receive messages to/from backend

  private currentSocketUrl: string | null = null;

  private getSocketUrl(ticketId: string) {
    const collaborationServiceSocket = collaborationService.replace(/^http(s?):\/\//i, 'ws$1://');
    return collaborationServiceSocket + collaborationSocketPath + ticketId;
  }

  async initSocket(ticketId: string) {
    this.currentSocketUrl = this.getSocketUrl(ticketId);
    this.currentSocket = this.websockets.socketFor(this.currentSocketUrl);
    this.currentSocket.on('message', this.messageHandler, this);
    this.currentSocket.on('close', this.closeHandler, this);
  }

  closeSocket() {
    if (this.currentSocketUrl) this.websockets.closeSocketFor(this.currentSocketUrl);
  }

  private closeHandler(event: any) {
    // Log that connection has been closed.
    if (event && event.code && event.target.url) {
      this.debug(
        `Connection to Backend-Extension ( ${event.target.url} ) closed, WebSocket close code ${event.code}.`,
      );
    }

    // Invoke external event listener for close event.
    // if (this.socketCloseCallback) {
    //   this.socketCloseCallback(event);
    // }

    // Remove internal event listeners.
    this.currentSocket.off('message', this.messageHandler);
    this.currentSocket.off('close', this.closeHandler);
    this.currentSocket = null;
    this.currentSocketUrl = null;
  }

  private messageHandler(event: any) {
    const message = JSON.parse(event.data);
    this.debug("Got a message" + message.event)
    if (message.event == 'forward') {
      this.trigger(message.originalMessage.event, message)
    } else {
      this.trigger(message.event, message)
    }
  }

  /**
   * Sends a message to the backend.
   *
   * The type parameter `T` is used to validate the type of the sent message
   * at compile time.
   *
   * @param msg The message to send.
   */
  send<T>(msg: T) {
    if (this.isWebSocketOpen()) this.currentSocket.send(JSON.stringify(msg));
  }

  isWebSocketOpen() {
    return this.currentSocket && this.currentSocket.readyState() === 1;
  }

  reset() {
    this.currentSocket = null;
    this.currentSocketUrl = null;
  }
}

declare module '@ember/service' {
  interface Registry {
    'web-socket': WebSocketService;
  }
}
