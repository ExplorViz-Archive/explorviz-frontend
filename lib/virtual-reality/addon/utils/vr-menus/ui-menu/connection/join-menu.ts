import VrRoomService, { RoomListRecord } from 'virtual-reality/services/vr-room';
import TextItem from "../../items/text-item";
import TextbuttonItem from "../../items/textbutton-item";
import ConnectionBaseMenu, { ConnectionBaseMenuArgs } from "./base";

/**
 * Time in seconds before the new room list should be fetched.
 */
const REFRESH_TIMEOUT = 3.0;

export type JoinMenuArgs = ConnectionBaseMenuArgs & {
  vrRoomService: VrRoomService
};

export default class JoinMenu extends ConnectionBaseMenu {
  private vrRoomService: VrRoomService;
  private refreshTimeout: number;

  constructor({ vrRoomService, ...args }: JoinMenuArgs) {
    super(args);
    this.vrRoomService = vrRoomService;
    this.refreshTimeout = 0;

    this.drawLoadingScreen();
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

  private async drawRoomList(rooms: RoomListRecord[]) {
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
        this.localUser.connect(Promise.resolve(room.id));
      }
      yPos += yOffset;
    }
    this.redrawMenu();
  }

  private drawErrorMessage(msg: string) {
    this.items.clear();

    // Draw loading screen.
    const title = new TextItem(
      `Error`,
      'title',
      '#ffffff',
      { x: 256, y: 20 },
      50,
      'center'
    );
    this.items.push(title);

    const text = new TextItem(
      msg,
      'title',
      '#ffffff',
      { x: 256, y: 100 },
      20,
      'center'
    );
    this.items.push(text);

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
      const rooms = await this.vrRoomService.listRooms();
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
