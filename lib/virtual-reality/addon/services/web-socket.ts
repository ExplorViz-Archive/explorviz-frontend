import Service, { inject as service } from '@ember/service';
import debugLogger from 'ember-debug-logger';

export default class WebSocketService extends Service {
  @service()
  websockets !: any;

  debug = debugLogger('VrMultiUser');

  private socket: any; // WebSocket to send/receive messages to/from backend

  host: string | null = '';

  port: string | null = '';

  secure: boolean | null = false;

  path: string | null = '';

  getSocketUrl() {
    return `${this.secure ? "wss" : "ws"}://${this.host}:${this.port}/${this.path}`;
  }

  socketCloseCallback: ((event: any) => void) | null = null;

  messageCallback: ((message: any) => void) | null = null;

  initSocket() {
    const socket = this.websockets.socketFor(this.getSocketUrl());
    socket.on('message', this.messageHandler, this);
    socket.on('close', this.closeHandler, this);
    this.socket = socket;
  }

  applyConfiguration(config: { host: string, port: string, secure: boolean, path: string }) {
    this.host = config.host;
    this.port = config.port;
    this.secure = config.secure;

    // Remove leading and tailing slashes such that the URL returned by 
    // `getSocketUrl` does not contain two leading slashes or any trailing
    // slash.
    this.path = config.path.replace(/^\/|\/$/g, "");
  }

  closeSocket() {
    this.websockets.closeSocketFor(this.getSocketUrl());
  }

  private closeHandler(event: any) {
    // Log that connection has been closed.
    if (event && event.code && event.target.url) {
      this.debug(`Connection to Backend-Extension ( ${event.target.url} ) closed, WebSocket close code ${event.code}.`);
    }

    // Invoke external event listener for close event.
    if (this.socketCloseCallback) {
      this.socketCloseCallback(event);
    }

    // Remove internal event listeners.
    this.socket.off('message', this.messageHandler);
    this.socket.off('close', this.closeHandler);
    this.socket = null;
  }

  private messageHandler(event: any) {
    const message = JSON.parse(event.data);
    if (this.eventCallback) {
      this.eventCallback(message.event, message);
    }
  }

  // Used to send messages to the backend
  send(obj: any) {
    if (this.isWebSocketOpen()) { this.socket.send(JSON.stringify(obj)); }
  }

  sendDisconnectRequest() {
    const disconnectMessage = [{
      event: 'receive_disconnect_request',
    }];
    this.send(disconnectMessage);
  }

  isWebSocketOpen() {
    return this.socket && this.socket.readyState() === 1;
  }

  reset() {
    this.socket = null;
    this.host = null;
    this.port = null;
    this.secure = null;
    this.path = null;
  }
}

declare module '@ember/service' {
  interface Registry {
    'web-socket': WebSocketService;
  }
}
