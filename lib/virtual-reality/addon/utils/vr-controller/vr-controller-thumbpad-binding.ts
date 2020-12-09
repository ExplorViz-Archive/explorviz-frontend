import VRController from "explorviz-frontend/utils/vr-rendering/VRController";

type VRControllerThumbpadLabels = {
    labelUp?: String;
    labelRight?: String;
    labelDown?: String;
    labelLeft?: String;
};

type VRControllerThumbpadCallbacks = {
    onThumbpadTouch?(controller: VRController, axes: number[]): void;
    onThumbpadDown?(controller: VRController, axes: number[]): void;
    onThumbpadPress?(controller: VRController, axes: number[]): void;
    onThumbpadUp?(controller: VRController, axes: number[]): void;
};

export default class VRControllerThumbpadBinding {
    labels: VRControllerThumbpadLabels;
    callbacks: VRControllerThumbpadCallbacks;

    constructor(labels : VRControllerThumbpadLabels, callbacks: VRControllerThumbpadCallbacks) {
        this.labels = labels;
        this.callbacks = callbacks;
    }
}