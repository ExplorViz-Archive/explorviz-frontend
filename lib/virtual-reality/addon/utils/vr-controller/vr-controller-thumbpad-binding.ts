import VRController from "explorviz-frontend/utils/vr-controller";
import VRControllerLabelGroup from "./vr-controller-label-group";
import VRControllerLabelMesh from "./vr-controller-label-mesh";
import THREE from "three";
import { VRControllerThumbpadLabelPositions } from "./vr-controller-label-positions";

type VRControllerThumbpadLabels = {
    labelUp?: string;
    labelRight?: string;
    labelDown?: string;
    labelLeft?: string;
};

type VRControllerThumbpadCallbacks = {
    onThumbpadTouch?(controller: VRController, axes: number[]): void;
    onThumbpadDown?(controller: VRController, axes: number[]): void;
    onThumbpadPress?(controller: VRController, axes: number[]): void;
    onThumbpadUp?(controller: VRController, axes: number[]): void;
};

export enum VRControllerThumbpadDirection { NONE, UP, RIGHT, DOWN, LEFT };

/**
 * Converts the given direction of the thumbpad into a 2D vector in a
 * coordinate system whose origin is in the top-left corner. 
 * 
 * @param direction The direction to convert.
 */
export function thumbpadDirectionToVector2(direction: VRControllerThumbpadDirection) {
    switch (direction) {
        case VRControllerThumbpadDirection.NONE: return new THREE.Vector2(0, 0);
        case VRControllerThumbpadDirection.UP: return new THREE.Vector2(0, -1);
        case VRControllerThumbpadDirection.RIGHT: return new THREE.Vector2(-1, 0);
        case VRControllerThumbpadDirection.DOWN: return new THREE.Vector2(0, 1);
        case VRControllerThumbpadDirection.LEFT: return new THREE.Vector2(-1, 0);
    }
}

export default class VRControllerThumbpadBinding {
    static getDirection(axes: number[]): VRControllerThumbpadDirection {
        if (axes[0] == 0 && axes[1] == 0) return VRControllerThumbpadDirection.NONE;

        const angle = THREE.MathUtils.RAD2DEG * Math.atan2(axes[1], axes[0]) + 180;
        if (angle < 45) return VRControllerThumbpadDirection.LEFT;
        if (angle < 135) return VRControllerThumbpadDirection.DOWN;
        if (angle < 225) return VRControllerThumbpadDirection.RIGHT;
        return VRControllerThumbpadDirection.UP;
    }

    labels: VRControllerThumbpadLabels;
    callbacks: VRControllerThumbpadCallbacks;

    constructor(labels : VRControllerThumbpadLabels, callbacks: VRControllerThumbpadCallbacks) {
        this.labels = labels;
        this.callbacks = callbacks;
    }

    addLabels(group: VRControllerLabelGroup, positions: VRControllerThumbpadLabelPositions): void {
        if (this.labels.labelUp && positions.positionUp) group.add(new VRControllerLabelMesh(this.labels.labelUp, positions.positionUp));
        if (this.labels.labelRight && positions.positionRight) group.add(new VRControllerLabelMesh(this.labels.labelRight, positions.positionRight));
        if (this.labels.labelDown && positions.positionDown) group.add(new VRControllerLabelMesh(this.labels.labelDown, positions.positionDown));
        if (this.labels.labelLeft && positions.positionLeft) group.add(new VRControllerLabelMesh(this.labels.labelLeft, positions.positionLeft));
    }
}
