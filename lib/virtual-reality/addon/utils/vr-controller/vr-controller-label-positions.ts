import THREE from "three";
import VRController from "../vr-rendering/VRController";

export enum VRControllerLabelOffsetDirection {
    LEFT = -1,
    RIGHT = 1
}

export type VRControllerLabelPosition = {
    buttonPosition: THREE.Vector3
    offsetDirection: VRControllerLabelOffsetDirection
}

export type VRControllerThumbpadLabelPositions = {
    positionUp?: VRControllerLabelPosition;
    positionRight?: VRControllerLabelPosition;
    positionDown?: VRControllerLabelPosition;
    positionLeft?: VRControllerLabelPosition;
};

export type VRControllerLabelPositions = {
    thumbpad: VRControllerThumbpadLabelPositions,
    triggerButton?: VRControllerLabelPosition,
    gripButton?: VRControllerLabelPosition,
    menuButton?: VRControllerLabelPosition,
};

export function getVRControllerLabelPositions(controller: VRController|null): VRControllerLabelPositions|null {
    const motionController = controller?.controllerModel.motionController;
    if (!controller || !motionController) return null;

    // Gets the position of a node of a visual response with the given name of
    // the given component. Returns `undefined` when thre is no such node.
    let visualResponsePosition = (component: any, name: string, nodeName: string): THREE.Vector3|undefined => {
        let visualResponse = component.visualResponses[`${component.rootNodeName}_${name}`];
        if (visualResponse && visualResponse[nodeName]) {
            let position = new THREE.Vector3();
            visualResponse[nodeName].getWorldPosition(position);
            return controller.controllerModel.worldToLocal(position);
        }
        return undefined;
    };

    // Gets the positions of the outermost points of the thumbpad
    let thumbpadPosition = (...componentNames: string[]): VRControllerThumbpadLabelPositions => {
        for (let componentName of componentNames) {
            let component = motionController.components[componentName];
            if (component) {
                let up = visualResponsePosition(component, 'yaxis_touched', 'minNode');
                let right = visualResponsePosition(component, 'xaxis_touched', 'maxNode');
                let down = visualResponsePosition(component, 'yaxis_touched', 'maxNode');
                let left = visualResponsePosition(component, 'xaxis_touched', 'minNode');
                return {
                    positionUp: up && {
                        buttonPosition: up,
                        offsetDirection: VRControllerLabelOffsetDirection.RIGHT
                    },
                    positionRight: right && {
                        buttonPosition: right,
                        offsetDirection: VRControllerLabelOffsetDirection.RIGHT
                    },
                    positionDown: down && {
                        buttonPosition: down,
                        offsetDirection: VRControllerLabelOffsetDirection.LEFT
                    },
                    positionLeft: left && {
                        buttonPosition: left,
                        offsetDirection: VRControllerLabelOffsetDirection.LEFT
                    },
                };
            }
        }
        return {};
    };

    // Gets the position of the value node of the first existing component
    // with one of the given names of the motion controller. 
    let buttonPosition = (...componentNames: string[]): VRControllerLabelPosition|undefined => {
        for (let componentName of componentNames) {
            let component = motionController.components[componentName];
            if (!component) continue;
            
            let position = visualResponsePosition(component, 'pressed', 'valueNode');
            if (!position) continue;
            
            return {
                buttonPosition: position,
                offsetDirection: VRControllerLabelOffsetDirection.RIGHT
            };
        }
        return undefined;
    };

    return {
        thumbpad: thumbpadPosition('xr-standard-touchpad'),
        triggerButton: buttonPosition('xr-standard-trigger'),
        gripButton: buttonPosition('xr-standard-squeeze'),
        menuButton: buttonPosition('menu', 'x-button', 'a-button')
    };
}
