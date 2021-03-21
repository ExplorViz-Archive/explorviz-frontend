import TextItem from "../../items/text-item";
import TextbuttonItem from "../../items/textbutton-item";
import ConnectionBaseMenu, { ConnectionBaseMenuArgs } from "./base";

export default class ConnectingMenu extends ConnectionBaseMenu {
  constructor(args: ConnectionBaseMenuArgs) {
    super(args);

    const title = new TextItem(
      'Connecting...',
      'title',
      '#ffffff',
      { x: 256, y: 20 },
      50,
      'center'
    );
    this.items.push(title);

    const cancelButton = new TextbuttonItem(
      'connect',
      "Cancel",
      { x: 100, y: 186 },
      316,
      50,
      28,
      '#555555',
      '#ffc338',
      '#929292'
    );
    this.items.push(cancelButton);
    this.thumbpadTargets.push(cancelButton);
    cancelButton.onTriggerDown = () => this.localUser.disconnect();

    this.redrawMenu();
  }
}
