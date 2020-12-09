import VRController from "explorviz-frontend/utils/vr-rendering/VRController";

type VRControllerButtonCallbacks<V> = {
    onButtonDown?(controller: VRController): void;
    onButtonPress?(controller: VRController, value: V): void;
    onButtonUp?(controller: VRController): void;
};

export default class VRControllerButtonBinding<V> {
    label: String;
    callbacks: VRControllerButtonCallbacks<V>;

    constructor(label: String, callbacks: VRControllerButtonCallbacks<V>) {
        this.label = label;
        this.callbacks = callbacks;
    }
}