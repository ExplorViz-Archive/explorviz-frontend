import BaseMenu, { BaseMenuArgs } from "../base-menu";
import GrabMenu, { GrabbableObject } from "./grab-menu";
import THREE from "three";
import VRControllerButtonBinding from "virtual-reality/utils/vr-controller/vr-controller-button-binding";

export class SharedScaleMenuState {
    readonly grabbedObject: GrabbableObject;
    readonly initialScale: THREE.Vector3;
    isGrabbedByBoth: boolean;
    private initialPositions: THREE.Vector3[];
    private _initialDistance: number;
    private currentPositions: THREE.Vector3[];

    constructor(grabbedObject: GrabbableObject) {
        this.grabbedObject = grabbedObject;
        this.initialScale = this.grabbedObject.scale.clone();
        this.isGrabbedByBoth = true;
        this.initialPositions = [];
        this._initialDistance = 0;
        this.currentPositions = [];
    }

    /**
     * The initial distance between the scale menus.
     */
    get initialDistance(): number {
        return this._initialDistance;
    }

    /**
     * The current distance between the scale menus.
     */
    get currentDistance(): number {
        let [p1, p2] = this.currentPositions;
        let currentDistance = p2.clone().sub(p1).length();
        return currentDistance;
    }

    /**
     * Remembers the given initial position of one of the scale menus.
     */
    addInitialPosition(position: THREE.Vector3) {
        this.initialPositions.push(position);

        // Calculate initial distance once the initial positions of both scale
        // menus are known.
        if (this.initialPositions.length == 2) {
            let [p1, p2] = this.initialPositions;
            this._initialDistance = p2.clone().sub(p1).length();
        }
    }

    /**
     * Remembers the given current position of one of the scale menus.
     */
    addCurrentPosition(position: THREE.Vector3) {
        this.currentPositions.push(position);
    }

    /**
     * Tests whether the both scale menus have written their current position
     * into the shared state in the current tick.
     */
    hasCurrentPositions(): boolean {
        return this.currentPositions.length == 2;
    }

    /**
     * Resets the current positions such that new positions can be collected
     * in the next tick.
     */
    clear() {
        this.currentPositions.clear();
    }
}

export type ScaleMenuArgs = BaseMenuArgs & {
    sharedState: SharedScaleMenuState,
}

export default class ScaleMenu extends BaseMenu {
    protected sharedState: SharedScaleMenuState;

    constructor({ sharedState, ...args }: ScaleMenuArgs) {
        super(args);
        this.sharedState = sharedState;
    }

    /**
     * Scales the grabbed object based on the change in distance between
     * the two scale menus.
     */
    private scaleGrabbedObject() {
        let scale = this.sharedState.currentDistance / this.sharedState.initialDistance;
        this.sharedState.grabbedObject.scale.copy(this.sharedState.initialScale).multiplyScalar(scale);
    }

    get enableControllerRay(): boolean {
        return true;
    }

    onOpenMenu() {
        super.onOpenMenu();

        let position = new THREE.Vector3();
        this.getWorldPosition(position);
        this.sharedState.addInitialPosition(position);
    }

    onUpdateMenu(delta: number) {
        super.onUpdateMenu(delta);

        // Close the scale menu and return to the grab menu when the other
        // controller released the object.
        if (!this.sharedState.isGrabbedByBoth) {
            this.closeMenu();
            return;
        }

        // Write current position into the shared state.
        let position = new THREE.Vector3();
        this.getWorldPosition(position);
        this.sharedState.addCurrentPosition(position);

        // Once the scale menu of both controllers has been updated, update
        // the grabbed object's scale factor.
        if (this.sharedState.hasCurrentPositions()) {
            this.scaleGrabbedObject();
            this.sharedState.clear();
        }
    }

    onCloseMenu() {
        super.onCloseMenu();
    }

    makeGripButtonBinding() {
        return new VRControllerButtonBinding('Release Object', {
            onButtonUp: () => {
                // Close this menu and the grab menu and notify the other scale
                // menu when the grip is released.
                this.sharedState.isGrabbedByBoth = false;
                this.closeMenusWhile((menu) => menu instanceof ScaleMenu || menu instanceof GrabMenu);
            }
        });
    }

    makeMenuButtonBinding() {
        // The menu button cannot be used to close the menu.
        return undefined;
    }
}
