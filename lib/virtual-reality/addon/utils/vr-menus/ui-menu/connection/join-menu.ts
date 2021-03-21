import { AjaxServiceClass } from 'ember-ajax/services/ajax';
import config from 'explorviz-frontend/config/environment';
import TextItem from "../../items/text-item";
import TextbuttonItem from "../../items/textbutton-item";
import ConnectionBaseMenu, { ConnectionBaseMenuArgs } from "./base";

/**
 * Time in seconds before the new room list should be fetched.
 */
const REFRESH_TIMEOUT = 3.0;

type RoomId = string;

type Room = {
  id: RoomId,
  name: string
};

function isRoomId(roomId: any): roomId is RoomId {
  return typeof roomId === 'string';
}

export type JoinMenuArgs = ConnectionBaseMenuArgs & {
  ajax: AjaxServiceClass
};

export default class JoinMenu extends ConnectionBaseMenu {
  private ajax: AjaxServiceClass;
  private refreshTimeout: number;

  constructor({ ajax, ...args }: JoinMenuArgs) {
    super(args);
    this.ajax = ajax;
    this.refreshTimeout = 0;

    this.drawLoadingScreen();
  }

  private async loadRoomList(): Promise<Room[]> {
    const url = `${config.APP.API_ROOT}/v2/vr/rooms`;
    const roomIds = await this.ajax.request(url);
    if (Array.isArray(roomIds) && roomIds.every(isRoomId)) {
      return roomIds.map((roomId) => {
        return { id: roomId, name: `Room ${roomId}` };
      });
    }
    throw 'invalid data';
  }

  private drawLoadingScreen() {
    this.items.clear();

    // Draw loading screen.
    const title = new TextItem(
      'Loading Rooms...',
      'title',
      '#ffffff',
      { x: 256, y: 20 },
      50,
      'center'
    );
    this.items.push(title);

    this.redrawMenu();
  }

  private async drawRoomList(rooms: Room[]) {
    this.items.clear();

    const title = new TextItem(
      `Join Room (${rooms.length})`,
      'title',
      '#ffffff',
      { x: 256, y: 20 },
      50,
      'center'
    );
    this.items.push(title);

    // Draw one button for each room.
    const yOffset = 60;
    let yPos = 50 + yOffset;
    for (let room of rooms) {
      const roomButton = new TextbuttonItem(
        `room-${room.id}`,
        room.name,
        { x: 100, y: yPos },
        316,
        50,
        28,
        '#555555',
        '#ffc338',
        '#929292'
      );
      this.items.push(roomButton);
      this.thumbpadTargets.push(roomButton);
      roomButton.onTriggerDown = () => {
        this.localUser.connect(room.id);
      }
      yPos += yOffset;
    }
    this.redrawMenu();
  }

  private drawErrorMessage(msg: string) {
    this.items.clear();

    // Draw loading screen.
    const title = new TextItem(
      `Error: ${msg}`,
      'title',
      '#ffffff',
      { x: 256, y: 20 },
      50,
      'center'
    );
    this.items.push(title);

    const retryButton = new TextbuttonItem('connect', "Retry", { x: 100, y: 186 }, 316, 50, 28, '#555555', '#ffc338', '#929292');
    this.items.push(retryButton);
    this.thumbpadTargets.push(retryButton);
    retryButton.onTriggerDown = () => {
      this.drawLoadingScreen();
      this.loadAndDrawRoomList();
    };

    this.redrawMenu();
  }

  private async loadAndDrawRoomList() {
    try {
      const rooms = await this.loadRoomList();
      this.drawRoomList(rooms);
      this.refreshTimeout = REFRESH_TIMEOUT;
    } catch (e) {
      this.drawErrorMessage(e);
    }
  }

  onOpenMenu() {
    super.onOpenMenu();
    this.loadAndDrawRoomList();
  }

  onUpdateMenu(delta: number) {
    super.onUpdateMenu(delta);

    // Refesh room list after timeout.
    if (this.refreshTimeout > 0) {
      this.refreshTimeout -= delta;
      if (this.refreshTimeout <= 0) {
        this.refreshTimeout = 0;
        this.loadAndDrawRoomList();
      }
    }
  }
}
