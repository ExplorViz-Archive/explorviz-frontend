import Service, { inject as service } from '@ember/service';
import debugLogger from 'ember-debug-logger';
import { AjaxServiceClass } from 'ember-ajax/services/ajax';

type WebSocketConfiguration = {
  host: string,
  port: number,
  secure: boolean,
  path: string,
};

function isWebSocketConfiguration(config: any): config is WebSocketConfiguration {
  return config !== null
      && typeof config === 'object'
      && typeof config.host === 'string'
      && typeof config.port === 'number'
      && typeof config.secure === 'boolean'
      && typeof config.path === 'string'
}

export default class WebSocketService extends Service {
  @service()
  private websockets !: any;

  @service('ajax')
  private ajax!: AjaxServiceClass;

  private debug = debugLogger('WebSocketService');

  private config: Promise<WebSocketConfiguration> | null = null;
  private currentSocket: any = null; // WebSocket to send/receive messages to/from backend
  private currentSocketUrl: string | null = null;

  socketCloseCallback: ((event: any) => void) | null = null;
  messageCallback: ((message: any) => void) | null = null;

  private async loadConfiguration(file: string): Promise<WebSocketConfiguration> {
    const config = await this.ajax.request(file);
    if (isWebSocketConfiguration(config)) return config;
    throw `invalid web socket configuration ${file}`;
  }

  private getSocketUrl(config: WebSocketConfiguration, roomId: string) {
    // Insert room id into the configured path and make sure that there are
    // no leading or trailing slashes.
    const path = config.path.replace('{room-id}', encodeURIComponent(roomId)).replace(/^\/|\/$/g, "");
    return `${config.secure ? "wss" : "ws"}://${config.host}:${config.port}/${path}`;
  }

  async initSocket(roomId: string) {
    // Load configuration file at most once.
    this.config = this.config || this.loadConfiguration('config/config_multiuser.json');
    const config = await this.config;

    this.currentSocketUrl = this.getSocketUrl(config, roomId);
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
      this.debug(`Connection to Backend-Extension ( ${event.target.url} ) closed, WebSocket close code ${event.code}.`);
    }

    // Invoke external event listener for close event.
    if (this.socketCloseCallback) {
      this.socketCloseCallback(event);
    }

    // Remove internal event listeners.
    this.currentSocket.off('message', this.messageHandler);
    this.currentSocket.off('close', this.closeHandler);
    this.currentSocket = null;
    this.currentSocketUrl = null;
  }

  private messageHandler(event: any) {
    const message = JSON.parse(event.data);
    if (this.messageCallback) {
      this.messageCallback(message);
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
