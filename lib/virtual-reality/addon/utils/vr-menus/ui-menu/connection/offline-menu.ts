import { AjaxServiceClass } from "ember-ajax/services/ajax";
import config from "explorviz-frontend/config/environment";
import TextItem from "../../items/text-item";
import TextbuttonItem from "../../items/textbutton-item";
import ConnectionBaseMenu, { ConnectionBaseMenuArgs } from "./base";

export type OfflineMenuArgs = ConnectionBaseMenuArgs & {
  ajax: AjaxServiceClass
};

export default class OfflineMenu extends ConnectionBaseMenu {
  private ajax: AjaxServiceClass;

  constructor({ ajax, ...args }: OfflineMenuArgs) {
    super(args);
    this.ajax = ajax;

    const title = new TextItem('You are offline', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const joinButton = new TextbuttonItem('connect', "Join Room", { x: 100, y: 156 }, 316, 50, 28, '#555555', '#ffc338', '#929292');
    this.items.push(joinButton);
    this.thumbpadTargets.push(joinButton);
    joinButton.onTriggerDown = () => {
      this.menuGroup?.replaceMenu(this.menuFactory.buildJoinMenu());
    };

    const newButton = new TextbuttonItem('connect', "New Room", { x: 100, y: 216 }, 316, 50, 28, '#555555', '#ffc338', '#929292');
    this.items.push(newButton);
    this.thumbpadTargets.push(newButton);
    newButton.onTriggerDown = () => this.createAndJoinNewRoom();

    this.redrawMenu();
  }

  async createAndJoinNewRoom() {
    const url = `${config.APP.API_ROOT}/v2/vr/room`;
    const roomId = await this.ajax.post(url);
    this.localUser.connect(roomId);
  }
}
