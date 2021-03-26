import VRControllerButtonBinding from "virtual-reality/utils/vr-controller/vr-controller-button-binding";
import BaseMenu, { BaseMenuArgs } from "../base-menu";


export default class DisableInputMenu extends BaseMenu {
  
  constructor(args: BaseMenuArgs) {
    super(args);
  }

  makeMenuButtonBinding(): VRControllerButtonBinding<undefined> | undefined {
    return undefined;
  };
}
