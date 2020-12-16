import THREE from "three";
import VRController from "../vr-rendering/VRController";
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

    /**
     * Finds the controller whose buttons the labels in this group point to or
     * returns `null` if the group does not have a parent controller.
     */
    findController(): VRController|null {
        let current = this.parent;
        while (current) {
            if (current instanceof VRController) return current;
            current = current.parent;
        }
        return null;
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
