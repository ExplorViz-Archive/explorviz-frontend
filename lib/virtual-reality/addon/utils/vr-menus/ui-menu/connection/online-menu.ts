import TextItem from "explorviz-frontend/utils/vr-menus/items/text-item";
import LocalVrUser from "virtual-reality/services/local-vr-user";
import VrMenuFactoryService from "virtual-reality/services/vr-menu-factory";
import ConnectionBaseMenu from "./base";

export default class OnlineMenu extends ConnectionBaseMenu {
    constructor(args: {
        localUser: LocalVrUser,
        menuFactory: VrMenuFactoryService
    }) {
        super(args);

        const title = new TextItem(
            'Yay, you are connected!', 
            'title', 
            '#ffffff', 
            { x: 256, y: 186 }, 
            50, 
            'center'
        );
        this.items.push(title);

        this.redrawMenu();
    }
}