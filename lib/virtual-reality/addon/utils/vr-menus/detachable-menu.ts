import { EntityType } from "../vr-message/util/entity_type";
import BaseMenu from "./base-menu";

export interface DetachableMenu extends BaseMenu {
    getDetachId(): string;
    getEntityType(): EntityType;
}

export function isDetachableMenu(menu: BaseMenu): menu is DetachableMenu {
    return 'getDetachId' in menu;
}