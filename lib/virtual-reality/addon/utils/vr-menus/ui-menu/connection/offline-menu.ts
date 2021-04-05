import VrRoomService from "virtual-reality/services/vr-room";
import TextbuttonItem from "../../items/textbutton-item";
import ConnectionBaseMenu, { ConnectionBaseMenuArgs } from "./base";
import TitleItem from "../../items/title-item";

export type OfflineMenuArgs = ConnectionBaseMenuArgs & {
  roomService: VrRoomService
};

export default class OfflineMenu extends ConnectionBaseMenu {
  private roomService: VrRoomService;

  constructor({ roomService, ...args }: OfflineMenuArgs) {
    super(args);
    this.roomService = roomService;

    const title = new TitleItem({
      text: 'You are offline',
      position: { x: 256, y: 20 },
    });
    this.items.push(title);

    const joinButton = new TextbuttonItem({
      text: "Join Room",
      position: { x: 100, y: 156 },
      width: 316,
      height: 50,
      fontSize: 28,
      onTriggerDown: () => this.menuGroup?.replaceMenu(this.menuFactory.buildJoinMenu())
    });
    this.items.push(joinButton);
    this.thumbpadTargets.push(joinButton);

    const newButton = new TextbuttonItem({
      text: "New Room",
      position: { x: 100, y: 216 },
      width: 316,
      height: 50,
      fontSize: 28,
      onTriggerDown: () => this.createAndJoinNewRoom()
    });
    this.items.push(newButton);
    this.thumbpadTargets.push(newButton);

    this.redrawMenu();
  }

  private createAndJoinNewRoom() {
    this.localUser.hostRoom();
  }
}
