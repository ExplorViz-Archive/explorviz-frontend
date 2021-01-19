import THREE from 'three';
import VrMessageReceiver from 'virtual-reality/utils/vr-message/receiver';
import VRControllerButtonBinding from 'virtual-reality/utils/vr-controller/vr-controller-button-binding';
import VRControllerThumbpadBinding from 'virtual-reality/utils/vr-controller/vr-controller-thumbpad-binding';
import VrMessageSender from 'virtual-reality/utils/vr-message/sender';
import VRController from 'virtual-reality/utils/vr-rendering/VRController';
import PseudoMenu from '../pseudo-menu';
import { isObjectGrabbedResponse, ObjectGrabbedResponse } from 'virtual-reality/utils/vr-message/receivable/response/grab';

export interface GrabbableObject extends THREE.Object3D {
    getGrabId(): string;
}

export function isGrabbableObject(object: any): object is GrabbableObject {
    return 'getGrabId' in object;
}

export default class GrabMenu extends PseudoMenu {
    sender: VrMessageSender;
    receiver: VrMessageReceiver;
    grabbedObject: GrabbableObject;
    grabbedObjectParent: THREE.Object3D|null;
    grabbedSuccessfully: boolean;
    originalIntersectableObjects: THREE.Object3D[]|null;

    constructor(grabbedObject: GrabbableObject, sender: VrMessageSender, receiver: VrMessageReceiver) {
        super();
        this.sender = sender;
        this.receiver = receiver;
        this.grabbedObject = grabbedObject;
        this.grabbedObjectParent = null;
        this.grabbedSuccessfully = false;
        this.originalIntersectableObjects = null;
    }

    /**
     * Moves the grabbed object into the controller's grip space. 
     */
    private addToGripSpace() {
        // Store original and parent of grabbed object.
        this.grabbedObjectParent = this.grabbedObject.parent;

        const controller = VRController.findController(this);
        if (controller) {
            // Get inverse of controller transformation.
            const matrix = new THREE.Matrix4();
            matrix.getInverse(controller.gripSpace.matrixWorld);
        
            // Set transforamtion relative to controller transformation.
            this.grabbedObject.matrix.premultiply(matrix);
            this.grabbedObject.matrix.decompose(
                this.grabbedObject.position, 
                this.grabbedObject.quaternion, 
                this.grabbedObject.scale
            );
            controller.gripSpace.add(this.grabbedObject);
        }
    }

    /**
     * Removes the grabbed object from the controller's grip space and adds it
     * back to its original parent.
     */
    private removeFromGripSpace() {
        const controller = VRController.findController(this);
        if (controller) {
            // Undo transformation of controller.
            this.grabbedObject.matrix.premultiply(controller.gripSpace.matrixWorld);
            this.grabbedObject.matrix.decompose(
                this.grabbedObject.position,
                this.grabbedObject.quaternion, 
                this.grabbedObject.scale
            );
        }
        
        // Restore original parent.
        this.grabbedObjectParent?.add(this.grabbedObject);
    }

    onOpenMenu() {
        super.onOpenMenu();

        // Send object grab message.
        const objectId = this.grabbedObject.getGrabId();
        const nonce = this.sender.sendObjectGrabbed(objectId);

        // Wait for response.
        this.receiver.awaitResponse(isObjectGrabbedResponse, nonce, (response: ObjectGrabbedResponse) => {
            // If we receive the answer too late, we ignore it.
            if (this.isMenuOpen) return;
            this.grabbedSuccessfully = response.success;

            // If we are allowed to grab the object, move it into the
            // controller's grip space.
            if (this.grabbedSuccessfully) {
                this.addToGripSpace();
            } else {
                this.closeMenu();
            }
        });
    }

    onUpdateMenu() {
        super.onUpdateMenu();

        // Send new position every frame if we are allowed to grab the object.
        if (this.grabbedSuccessfully) {
            const objectId = this.grabbedObject.getGrabId();
            const position = new THREE.Vector3();
            const quaternion = new THREE.Quaternion();
            this.grabbedObject.getWorldPosition(position);
            this.grabbedObject.getWorldQuaternion(quaternion);
            this.sender.sendObjectMoved(objectId, position, quaternion);
        }
    }

    onCloseMenu() {
        super.onCloseMenu();

        // Always send object released message to ensure that the backend knows
        // that we don't want to grab the object anymore even if we did not yet
        // receive the response.
        const objectId = this.grabbedObject.getGrabId();
        this.sender.sendObjectReleased(objectId);
        
        // If we received the response and were allowed to grab the object,
        // we have to detach the object from the controller.
        if (this.grabbedSuccessfully) {
            this.removeFromGripSpace();
        }
    }

    makeThumbpadBinding() {
        return new VRControllerThumbpadBinding({
            labelUp: 'Move Away',
            labelDown: 'Move Closer'
          }, {
            onThumbpadTouch: (_controller: VRController, _axes: number[]) => {
                // TODO move object closer / further away
            }
        });
    }

    makeGripButtonBinding() {
        return new VRControllerButtonBinding('Release Object', {
            onButtonUp: this.closeMenu.bind(this)
        });
    }

    makeMenuButtonBinding() {
        return undefined;
    }
}