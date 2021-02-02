import THREE from 'three';
import VRControllerButtonBinding from 'virtual-reality/utils/vr-controller/vr-controller-button-binding';
import VRControllerThumbpadBinding from 'virtual-reality/utils/vr-controller/vr-controller-thumbpad-binding';
import VRController from 'virtual-reality/utils/vr-rendering/VRController';
import DeltaTime from 'virtual-reality/services/delta-time';
import BaseMenu from '../base-menu';
import GrabbedObjectService from 'virtual-reality/services/grabbed-object';

export interface GrabbableObject extends THREE.Object3D {
    getGrabId(): string | null;
}

export function isGrabbableObject(object: any): object is GrabbableObject {
    return object !== null
        && typeof object === 'object'
        && typeof object.getGrabId === 'function';
}

export function findGrabbableObject(root: THREE.Object3D, objectId: string): GrabbableObject | null {
    let objects = [root];
    while (objects.length > 0) {
        let object = objects.shift();
        if (isGrabbableObject(object) && object.getGrabId() === objectId) return object;
        if (object) objects.push(...object.children);
    }
    return null;
}

export default class GrabMenu extends BaseMenu {
    private grabbedObject: GrabbableObject;
    private grabbedObjectParent: THREE.Object3D | null;
    private grabbedObjectService: GrabbedObjectService;
    private deltaTimeService: DeltaTime;

    constructor(grabbedObject: GrabbableObject, grabbedObjectService: GrabbedObjectService, deltaTimeService: DeltaTime) {
        super();
        this.grabbedObject = grabbedObject;
        this.grabbedObjectParent = null;
        this.grabbedObjectService = grabbedObjectService;
        this.deltaTimeService = deltaTimeService;
    }

    /**
     * Moves the grabbed object into the controller's grip space. 
     */
    private addToGripSpace() {
        // Don't grab the object when the menu has been closed or paused
        // since the object was requested to be grabbed.
        const controller = VRController.findController(this);
        if (controller && this.isMenuOpen) {
            // Get inverse of controller transformation.
            const matrix = new THREE.Matrix4();
            matrix.getInverse(controller.gripSpace.matrixWorld);

            // Store original and parent of grabbed object.
            this.grabbedObjectParent = this.grabbedObject.parent;

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
        // If the object has not been grabbed, it cannot be released.
        if (!this.grabbedObjectParent) return;

        // Undo transformation of controller.
        const controller = VRController.findController(this);
        if (controller) {
            this.grabbedObject.matrix.premultiply(controller.gripSpace.matrixWorld);
            this.grabbedObject.matrix.decompose(
                this.grabbedObject.position,
                this.grabbedObject.quaternion,
                this.grabbedObject.scale
            );
        }

        // Restore original parent.
        this.grabbedObjectParent.add(this.grabbedObject);
        this.grabbedObjectParent = null;
    }

    async onOpenMenu() {
        super.onOpenMenu();

        // Grab the object only when we are allowed to grab it.
        const allowedToGrab = await this.grabbedObjectService.grabObject(this.grabbedObject);
        if (allowedToGrab) {
            this.addToGripSpace();
        } else {
            this.closeMenu();
        }
    }

    onPauseMenu() {
        // Release the grabbed object when another menu is opened (e.g., the
        // scale menu).
        super.onPauseMenu();
        this.removeFromGripSpace();
    }

    makeThumbpadBinding() {
        return new VRControllerThumbpadBinding({
            labelUp: 'Move Away',
            labelDown: 'Move Closer'
        }, {
            onThumbpadTouch: (controller: VRController, axes: number[]) => {
                controller.updateIntersectedObject();
                if (!controller.intersectedObject) return;

                // Position where ray hits the application
                const intersectionPosWorld = controller.intersectedObject.point;
                const intersectionPosLocal = intersectionPosWorld.clone();
                this.grabbedObject.worldToLocal(intersectionPosLocal);

                const controllerPosition = new THREE.Vector3();
                controller.raySpace.getWorldPosition(controllerPosition);
                const controllerPositionLocal = controllerPosition.clone();
                this.grabbedObject.worldToLocal(controllerPositionLocal);

                const direction = new THREE.Vector3();
                direction.subVectors(intersectionPosLocal, controllerPositionLocal);

                const worldDirection = new THREE.Vector3().subVectors(controllerPosition, intersectionPosWorld);

                // Stop object from moving too close to controller.
                const yAxis = axes[1];
                if ((worldDirection.length() > 0.5 && Math.abs(yAxis) > 0.1)
                    || (worldDirection.length() <= 0.5 && yAxis > 0.1)) {
                    // Adapt distance for moving according to trigger value.
                    direction.normalize();
                    const length = yAxis * this.deltaTimeService.getDeltaTime();

                    this.grabbedObject.translateOnAxis(direction, length);
                    this.grabbedObject.updateMatrix();
                }
            }
        });
    }

    get enableControllerRay(): boolean {
        return true;
    }

    makeGripButtonBinding() {
        return new VRControllerButtonBinding('Release Object', {
            onButtonUp: this.closeMenu.bind(this)
        });
    }

    makeMenuButtonBinding() {
        // The menu button cannot be used to close the menu.
        return undefined;
    }
}