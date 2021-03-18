import VRControllerBindings from './vr-controller-bindings';
import { VRControllerCallbackFunctions } from '../vr-controller';

export default class VRControllerBindingsList {
    defaultBindings: VRControllerBindings;
    controllerBindings: VRControllerBindings[];

    constructor(defaultBindings: VRControllerBindings, controllerBindings: VRControllerBindings[]) {
        this.defaultBindings = defaultBindings;
        this.controllerBindings = controllerBindings;
    }

    get currentBindings(): VRControllerBindings {
        if (this.controllerBindings.length === 0) return this.defaultBindings;
        return this.controllerBindings[this.controllerBindings.length - 1];
    }

    makeCallbacks(): VRControllerCallbackFunctions {
        return {
            thumbpadTouch: (controller, axes) => this.currentBindings.thumbpad?.callbacks.onThumbpadTouch?.call(null, controller, axes),
            thumbpadDown: (controller, axes) => this.currentBindings.thumbpad?.callbacks.onThumbpadDown?.call(null, controller, axes),
            thumbpadPress: (controller, axes) => this.currentBindings.thumbpad?.callbacks.onThumbpadPress?.call(null, controller, axes),
            thumbpadUp: (controller, axes) => this.currentBindings.thumbpad?.callbacks.onThumbpadUp?.call(null, controller, axes),

            triggerDown: (controller) => this.currentBindings.triggerButton?.callbacks.onButtonDown?.call(null, controller),
            triggerPress: (controller, value) => this.currentBindings.triggerButton?.callbacks.onButtonPress?.call(null, controller, value),
            triggerUp: (controller) => this.currentBindings.triggerButton?.callbacks.onButtonUp?.call(null, controller),

            gripDown: (controller) => this.currentBindings.gripButton?.callbacks.onButtonDown?.call(null, controller),
            gripPress: (controller) => this.currentBindings.gripButton?.callbacks.onButtonPress?.call(null, controller),
            gripUp: (controller) => this.currentBindings.gripButton?.callbacks.onButtonUp?.call(null, controller),

            menuUp: (controller) => this.currentBindings.menuButton?.callbacks.onButtonDown?.call(null, controller),
            menuPress: (controller) => this.currentBindings.menuButton?.callbacks.onButtonPress?.call(null, controller),
            menuDown: (controller) => this.currentBindings.menuButton?.callbacks.onButtonUp?.call(null, controller),
        };
    }
}
