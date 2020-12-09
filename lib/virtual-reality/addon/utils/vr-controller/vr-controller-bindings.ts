import VRControllerButtonBinding from "./vr-controller-button-binding";
import VRControllerThumbpadBinding from "./vr-controller-thumbpad-binding";

export default class VRControllerBindings {
    thumbpad?: VRControllerThumbpadBinding;
    triggerButton?: VRControllerButtonBinding<number>;
    gripButton?: VRControllerButtonBinding<undefined>;
    menuButton?: VRControllerButtonBinding<undefined>;

    constructor({thumbpad, triggerButton, gripButton, menuButton} : {
        thumbpad?: VRControllerThumbpadBinding,
        triggerButton?: VRControllerButtonBinding<number>,
        gripButton?: VRControllerButtonBinding<undefined>,
        menuButton?: VRControllerButtonBinding<undefined>
    }) {
        this.thumbpad = thumbpad;
        this.triggerButton = triggerButton;
        this.gripButton = gripButton;
        this.menuButton = menuButton;
    }
}