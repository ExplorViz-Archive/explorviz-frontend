import LocalVrUser from "virtual-reality/services/local-vr-user";
import VrMenuFactoryService from "virtual-reality/services/vr-menu-factory";
import ConnectionBaseMenu from "./base";

export default class JoinMenu extends ConnectionBaseMenu {
    constructor(args: {
        localUser: LocalVrUser,
        menuFactory: VrMenuFactoryService
    }) {
        super(args);

        this.redrawMenu();
    }
}