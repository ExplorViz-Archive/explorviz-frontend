import THREE, { Raycaster } from 'three';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import LabelMesh from 'explorviz-frontend/view-objects/3d/label-mesh';
import XRControllerModelFactory from './XRControllerModelFactory';
import XRControllerModel from './XRControllerModel';
import { MotionController } from './motion-controllers.module';
import FloorMesh from './floor-mesh';
import TeleportMesh from './teleport-mesh';

type CallbackFunctions = {
  connected? (event: THREE.Event): void,
  disconnected? (): void,
  thumbpad? (axes: number[]): void,
  thumbpadUp?(): void,
  thumbpadDown?(): void,
  triggerUp?(): void,
  triggerDown?(): void,
  gripUp?(): void,
  gripDown?(): void,
  menuUp?(): void,
  menuDown? (): void,
};

/**
 * A wrapper around the gamepad object which handles inputs to
 * a VR controller and provides update and callback functionalities.
 */
export default class VRController extends THREE.Group {
  gamepadIndex: number;

  gamepad: Gamepad|null = null;

  axes = [0, 0];

  thumbpadIsPressed = false;

  triggerIsPressed = false;

  gripIsPressed = false;

  menuIsPressed = false;

  timestamp = 0;

  eventCallbacks: CallbackFunctions;

  gripSpace: THREE.Group;

  raySpace: THREE.Group;

  ray: THREE.Line|null = null;

  controllerModel: XRControllerModel;

  motionController: MotionController|null;

  intersectedObject: THREE.Intersection|null = null;

  raycaster: THREE.Raycaster;

  scene: THREE.Scene;

  intersectableObjects: THREE.Object3D[] = [];

  teleportArea: TeleportMesh|null = null;

  /**
   * @param gamepad Object of gamepad API which grants access to VR controller inputs
   * @param eventCallbacks Object with functions that are called when certain events occur
   */
  constructor(gamepadIndex: number, gripSpace: THREE.Group, raySpace: THREE.Group,
    eventCallbacks: CallbackFunctions, scene: THREE.Scene) {
    super();
    // Init properties
    this.gamepadIndex = gamepadIndex;
    this.gripSpace = gripSpace;
    this.raySpace = raySpace;
    this.raycaster = new Raycaster();
    this.scene = scene;
    this.eventCallbacks = { ...eventCallbacks };

    // Init controller model
    const controllerModelFactory = new XRControllerModelFactory();
    this.controllerModel = controllerModelFactory.createControllerModel(this.gripSpace);
    this.gripSpace.add(this.controllerModel);
    this.motionController = this.controllerModel.motionController;

    this.add(this.gripSpace);
    this.add(this.raySpace);

    this.findGamepad();

    this.initConnectionListeners();
  }

  initConnectionListeners() {
    const callbacks = this.eventCallbacks;

    this.gripSpace.addEventListener('connected', (event) => {
      this.findGamepad();
      if (this.gamepadIndex === 1) this.initTeleportArea();
      if (callbacks.connected) callbacks.connected(event);
    });
    this.gripSpace.addEventListener('disconnected', () => {
      this.findGamepad();
      this.removeTeleportArea();
      if (callbacks.disconnected) callbacks.disconnected();
    });
  }

  findGamepad() {
    const gamepads = navigator.getGamepads();
    gamepads.forEach((gamepad) => {
      if (gamepad && gamepad.index === this.gamepadIndex) {
        this.gamepad = gamepad;
      }
    });
  }

  addRay(color: THREE.Color) {
    if (this.ray) return;

    const geometry = new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)],
    );

    const material = new THREE.LineBasicMaterial({
      color,
    });

    const line = new THREE.Line(geometry, material);
    line.scale.z = 5;

    this.ray = line;
    this.raySpace.add(this.ray);
  }

  initTeleportArea() {
    // Create teleport area
    this.teleportArea = new TeleportMesh();

    // Add teleport area to parent (usually the scene object)
    this.scene.add(this.teleportArea);
  }

  removeTeleportArea() {
    const { teleportArea } = this;

    // Remove teleport area
    if (teleportArea) {
      teleportArea.deleteFromParent();
      teleportArea.disposeRecursively();
      this.teleportArea = null;
    }
  }

  update() {
    this.updateGamepad();
    this.updateIntersectedObject();
  }

  /**
   * Updates the current button states according to the gamepad object.
   * Whenever a button change or press event is registered, the according
   * callback functions (provided via the constructor) are called.
   */
  updateGamepad() {
    const { gamepad } = this;
    const callbacks = this.eventCallbacks;

    const THUMBPAD_BUTTON = 0;
    const TRIGGER_BUTTON = 1;
    const GRIP_BUTTON = 2;
    const MENU_BUTTON = 3;

    if (gamepad) {
      const { timestamp } = gamepad;

      // Ensure that gamepad data is fresh
      if (this.timestamp === timestamp) {
        return;
      }
      this.timestamp = timestamp;

      // Handle change in joystick / thumbpad position
      if (this.axes[0] !== gamepad.axes[0] || this.axes[1] !== gamepad.axes[1]) {
        [this.axes[0], this.axes[1]] = gamepad.axes;
        if (callbacks.thumbpad) {
          callbacks.thumbpad(this.axes);
        }
      }

      // Handle clicked / released thumbpad
      if (this.thumbpadIsPressed !== gamepad.buttons[THUMBPAD_BUTTON].pressed) {
        this.thumbpadIsPressed = gamepad.buttons[THUMBPAD_BUTTON].pressed;
        if (this.thumbpadIsPressed && callbacks.thumbpadDown) {
          callbacks.thumbpadDown();
        } else if (!this.thumbpadIsPressed && callbacks.thumbpadUp) {
          callbacks.thumbpadUp();
        }
      }

      // Handle clicked / released trigger
      if (this.triggerIsPressed !== gamepad.buttons[TRIGGER_BUTTON].pressed) {
        this.triggerIsPressed = gamepad.buttons[TRIGGER_BUTTON].pressed;
        if (this.triggerIsPressed && callbacks.triggerDown) {
          callbacks.triggerDown();
        } else if (!this.triggerIsPressed && callbacks.triggerUp) {
          callbacks.triggerUp();
        }
      }

      // Handle clicked released grip button
      if (gamepad.buttons[GRIP_BUTTON]
        && this.gripIsPressed !== gamepad.buttons[GRIP_BUTTON].pressed) {
        this.gripIsPressed = gamepad.buttons[GRIP_BUTTON].pressed;
        if (this.gripIsPressed && callbacks.gripDown) {
          callbacks.gripDown();
        } else if (!this.gripIsPressed && callbacks.gripUp) {
          callbacks.gripUp();
        }
      }

      // Handle clicked / released menu button
      if (gamepad.buttons[MENU_BUTTON]
        && this.menuIsPressed !== gamepad.buttons[MENU_BUTTON].pressed) {
        this.menuIsPressed = gamepad.buttons[MENU_BUTTON].pressed;
        if (this.menuIsPressed && callbacks.menuDown) {
          callbacks.menuDown();
        } else if (!this.menuIsPressed && callbacks.menuUp) {
          callbacks.menuUp();
        }
      }
    }
  }

  computeIntersections() {
    if (this.intersectableObjects.length === 0) return [];

    const { raySpace } = this;
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(raySpace.matrixWorld);

    this.raycaster.ray.origin.setFromMatrixPosition(raySpace.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    const intersections = this.raycaster.intersectObjects(this.intersectableObjects, true);

    for (let i = 0; i < intersections.length; i++) {
      const { object } = intersections[i];
      if (!(object instanceof LabelMesh) && object.visible) {
        return [intersections[i]];
      }
    }

    return [];
  }

  updateIntersectedObject() {
    if (!this.ray) return;

    /* Reset hover effect and teleportation area */
    this.resetHoverEffect();

    const intersections = this.computeIntersections();

    const [nearestIntersection] = intersections;

    if (!nearestIntersection) {
      this.ray.scale.z = 5;
      return;
    }

    const { object } = nearestIntersection;

    // Handle hover effect and teleport area
    if (this.gamepadIndex === 0) {
      if (object instanceof BaseMesh) {
        object.applyHoverEffect(1.4);
      }
    } else if (this.gamepadIndex === 1) {
      if (object instanceof FloorMesh) {
        if (this.teleportArea) this.teleportArea.showAbovePosition(nearestIntersection.point);
      } else if (object instanceof BaseMesh) {
        object.applyHoverEffect(1.4);
      }
    }

    // Store intersected object and scale ray accordingly
    this.intersectedObject = nearestIntersection;
    this.ray.scale.z = nearestIntersection.distance;
  }

  /**
   * Resets the hover effect of the object which was previously hovered upon by the controller.
   *
   * @param controller Controller of which the hover effect shall be reseted.
   */
  resetHoverEffect() {
    if (!this.intersectedObject || !this.intersectedObject.object) return;

    const { object } = this.intersectedObject;

    if (object instanceof BaseMesh) {
      object.resetHoverEffect();
      this.intersectedObject = null;
    }
    if (this.teleportArea) {
      this.teleportArea.visible = false;
    }
  }
}
