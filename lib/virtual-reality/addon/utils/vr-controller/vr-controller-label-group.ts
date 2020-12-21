import THREE from "three";
import VRControllerBindings from "./vr-controller-bindings";
import VRControllerBindingsList from "./vr-controller-bindings-list";

export default class VRControllerLabelGroup extends THREE.Group {
    controllerBindings: VRControllerBindingsList;
    lastControllerBindings: VRControllerBindings|null;

    constructor(controllerBindings: VRControllerBindingsList) {
        super();
        this.controllerBindings = controllerBindings;
        this.lastControllerBindings = null;
    }


    updateLabels() {
        // Test whether the controller bindings changed since the last update.
        let bindings = this.controllerBindings.currentBindings;
        if (bindings !== this.lastControllerBindings) {
            // Remove all existing labels.
            this.remove(...this.children);

            // Add new meshes for the labels of the current bindings.
            bindings.addLabels(this);
            this.lastControllerBindings = bindings;
        }
    }
}
