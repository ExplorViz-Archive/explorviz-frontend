type CallbackFunctions = {
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
export default class VRController {
  gamepad: Gamepad;

  axes = [0, 0];

  thumbpadIsPressed = false;

  triggerIsPressed = false;

  gripIsPressed = false;

  menuIsPressed = false;

  timestamp = 0;

  eventCallbacks: CallbackFunctions;

  /**
   * @param gamepad Object of gamepad API which grants access to VR controller inputs
   * @param eventCallbacks Object with functions that are called when certain events occur
   */
  constructor(gamepad: Gamepad, eventCallbacks: CallbackFunctions) {
    this.gamepad = gamepad;
    this.eventCallbacks = eventCallbacks;
  }

  /**
   * Updates the current button states according to the gamepad object.
   * Whenever a button change or press event is registered, the according
   * callback functions (provided via the constructor) are called.
   */
  update() {
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
        && this.menuIsPressed !== gamepad.buttons[GRIP_BUTTON].pressed) {
        this.menuIsPressed = gamepad.buttons[MENU_BUTTON].pressed;
        if (this.menuIsPressed && callbacks.menuDown) {
          callbacks.menuDown();
        } else if (!this.menuIsPressed && callbacks.menuUp) {
          callbacks.menuUp();
        }
      }
    }
  }
}
