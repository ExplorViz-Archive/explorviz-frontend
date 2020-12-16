import VRController from "explorviz-frontend/utils/vr-rendering/VRController";
import THREE from "three";

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

    static getDirection(axes: number[]) {
        const angle = THREE.MathUtils.RAD2DEG * Math.atan(axes[1] / axes[0]);
        if (angle < 45) return 'right';
        if (angle < 135) return 'up';
        if (angle < 225) return 'left';
        return 'down';
    }
}