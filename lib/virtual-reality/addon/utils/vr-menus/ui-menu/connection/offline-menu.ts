import TextItem from "explorviz-frontend/utils/vr-menus/items/text-item";
import TextbuttonItem from "explorviz-frontend/utils/vr-menus/items/textbutton-item";
import LocalVrUser from "virtual-reality/services/local-vr-user";
import VrMenuFactoryService from "virtual-reality/services/vr-menu-factory";
import ConnectionBaseMenu from "./base";

const ROOM_ID = '2';

export default class OfflineMenu extends ConnectionBaseMenu {
    constructor(args: {
        localUser: LocalVrUser,
        menuFactory: VrMenuFactoryService
    }) {
        super(args);

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
        newButton.onTriggerDown = () => {
          this.localUser.connect(ROOM_ID);
        };

        this.redrawMenu();
    }
}