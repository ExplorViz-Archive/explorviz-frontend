import THREE from "three";
import VRController from "../vr-rendering/VRController";
import VRControllerButtonBinding from "./vr-controller-button-binding";
import VRControllerLabelGroup from "./vr-controller-label-group";
import { VRControllerLabelOffsetDirection, VRControllerLabelPosition } from "./vr-controller-label-mesh";
import VRControllerThumbpadBinding, {VRControllerThumbpadLabelPositions} from "./vr-controller-thumbpad-binding";

export type VRControllerLabelPositions = {
    thumbpad: VRControllerThumbpadLabelPositions,
    triggerButton: VRControllerLabelPosition,
    gripButton: VRControllerLabelPosition,
    menuButton: VRControllerLabelPosition,
};

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

    getLabelPositions(_controller: VRController): VRControllerLabelPositions {
        // TODO select labels based controller
        return {
            thumbpad: {
                positionUp: {
                    buttonPosition: new THREE.Vector3(
                        0,
                        -0.033872,
                        0.003366
                    ),
                    offsetDirection: VRControllerLabelOffsetDirection.RIGHT
                },
                positionRight: {
                    buttonPosition: new THREE.Vector3(
                        0.016873,
                        -0.048138,
                        0.003366
                    ),
                    offsetDirection: VRControllerLabelOffsetDirection.RIGHT
                },
                positionDown: {
                    buttonPosition: new THREE.Vector3(
                        0,
                        -0.062405,
                        0.003366
                    ),
                    offsetDirection: VRControllerLabelOffsetDirection.RIGHT
                },
                positionLeft: {
                    buttonPosition: new THREE.Vector3(
                        -0.015705,
                        -0.048138,
                        0.003366
                    ),
                    offsetDirection: VRControllerLabelOffsetDirection.LEFT
                },
            },
            triggerButton: {
                buttonPosition: new THREE.Vector3(
                    -0.000556,
                    -0.049577,
                    -0.028753
                ),
                offsetDirection: VRControllerLabelOffsetDirection.RIGHT
            },
            gripButton: {
                buttonPosition: new THREE.Vector3(
                    0.019909,
                    -0.087138,
                    -0.01536
                ),
                offsetDirection: VRControllerLabelOffsetDirection.RIGHT
            },
            menuButton: {
                buttonPosition: new THREE.Vector3(
                    0,
                    -0.019967,
                    0.007694
                ),
                offsetDirection: VRControllerLabelOffsetDirection.RIGHT
            }
        };
    }

    addLabels(group: VRControllerLabelGroup): void {
        // Add labels only if the group has a parent controller.
        const controller = group.findController();
        if (controller) {
            // The label positions depend on the controller model.
            const positions = this.getLabelPositions(controller);
            this.thumbpad?.addLabels(group, positions.thumbpad);
            this.triggerButton?.addLabel(group, positions.triggerButton);
            this.gripButton?.addLabel(group, positions.gripButton);
            this.menuButton?.addLabel(group, positions.menuButton);
        }
    }
}