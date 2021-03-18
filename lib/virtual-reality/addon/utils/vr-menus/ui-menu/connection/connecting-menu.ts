import TextItem from "explorviz-frontend/utils/vr-menus/items/text-item";
import TextbuttonItem from "explorviz-frontend/utils/vr-menus/items/textbutton-item";
import LocalVrUser from "virtual-reality/services/local-vr-user";
import VrMenuFactoryService from "virtual-reality/services/vr-menu-factory";
import ConnectionBaseMenu from "./base";

export default class ConnectingMenu extends ConnectionBaseMenu {
    constructor(args: {
        localUser: LocalVrUser,
        menuFactory: VrMenuFactoryService
    }) {
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